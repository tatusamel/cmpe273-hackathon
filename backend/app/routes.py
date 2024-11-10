from flask import Blueprint, jsonify, request
from .models import Conversation, Message
from flask_cors import CORS 
from . import db, redis_client
import hashlib
import io
import base64
from pdf2image import convert_from_path
from byaldi import RAGMultiModalModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

main = Blueprint('main', __name__)
CORS(main, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
open_ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_DIR = os.path.join(BASE_DIR, "index")
IMAGE_DIR = os.path.join(BASE_DIR, "images")

RAG = RAGMultiModalModel.from_index(INDEX_DIR)

image_dir = IMAGE_DIR


def get_cached_response(prompt: str) -> str | None:
    prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
    return redis_client.get(prompt_hash)


def cache_response(prompt: str, response: str) -> str | None:
    prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
    redis_client.setex(prompt_hash, 86400, response)


@main.route('/api/conversations', methods=['GET'])
def get_conversations():
    conversations = Conversation.query.all()
    data = [{
        'id': conv.id,
        'title': conv.title,
        'createdAt': conv.created_at.isoformat()
    } for conv in conversations]
    return jsonify(data)

@main.route('/api/conversations', methods=['POST'])
def create_conversation():
    data = request.json
    new_conv = Conversation(title=data.get('title', 'New Conversation'))
    db.session.add(new_conv)
    db.session.commit()
    return jsonify({
        'id': new_conv.id,
        'title': new_conv.title,
        'createdAt': new_conv.created_at.isoformat()
    })

@main.route('/api/conversations/<int:conv_id>', methods=['PUT'])
def update_conversation(conv_id):
    data = request.json
    conversation = Conversation.query.get_or_404(conv_id)
    conversation.title = data.get('title', conversation.title)
    db.session.commit()
    return jsonify({
        'id': conversation.id,
        'title': conversation.title,
        'createdAt': conversation.created_at.isoformat()
    })

@main.route('/api/conversations/<int:conv_id>', methods=['DELETE'])
def delete_conversation(conv_id):
    try:
        conversation = Conversation.query.get_or_404(conv_id)
        db.session.delete(conversation)
        db.session.commit()
        return jsonify({'message': 'Conversation deleted.'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main.route('/api/conversations/<int:conv_id>/messages', methods=['GET'])
def get_messages(conv_id):
    messages = Message.query.filter_by(conversation_id=conv_id).order_by(Message.timestamp).all()
    data = [{
        'id': msg.id,
        'sender': msg.sender,
        'content': msg.content,
        'timestamp': msg.timestamp.isoformat()
    } for msg in messages]
    return jsonify(data)

@main.route('/api/conversations/<int:conv_id>/messages', methods=['POST'])
def send_message(conv_id):
    data = request.json
    user_prompt = data['content']

    user_msg = Message(sender='user', content=user_prompt, conversation_id=conv_id)
    db.session.add(user_msg)

    cached_response = get_cached_response(user_prompt)

    if cached_response:
        ai_content = cached_response
    else:
        ai_content = generate_response(user_prompt)
        cache_response(user_prompt, ai_content)

    
    ai_response = Message(sender='ai', content=ai_content, conversation_id=conv_id)
    
    db.session.add(ai_response)
    db.session.commit()

    return jsonify({
        'message': 'Message sent.',
        'response': ai_content,
        'cached': cached_response is not None
    })



def generate_response(query):
    # Search the index for relevant pages
    results = RAG.search(query, k=3)
    image_index = results[0]["page_num"] - 1

    # Retrieve the pre-saved image from disk
    image_path = os.path.join(image_dir, f"page_{image_index + 1}.jpeg")
    with open(image_path, "rb") as image_file:
        img_str = base64.b64encode(image_file.read()).decode()
        img_str = f"data:image/jpeg;base64,{img_str}"

    # Generate AI response using OpenAI's GPT model
    response = open_ai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text",
                     "text": "If numerical trends or values are requested in the query, "
                             "make reasonable estimates from the data visualizations "
                             "shown in the images. Query:" + query},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_str
                        },
                    },
                ],
            }
        ],
        max_tokens=500,
    )

    # Determine which book the page belongs to
    book = "SOFI-2023"
    if image_index + 1 > 316:
        image_index -= 316
        book = "SOFI-2024"

    return f"{response.choices[0].message.content}\n##### Source: Pg. No. {image_index + 30} of {book}"