from flask import Blueprint, jsonify, request
from .models import Conversation, Message
from flask_cors import CORS 
from . import db, redis_client
import hashlib
import random

main = Blueprint('main', __name__)
CORS(main, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# will remove it later
SAMPLE_RESPONSES = [
    "That's an interesting perspective. Let me share my thoughts...",
    "Based on the available information, I would say...",
    "Here's what I think about that topic...",
    "Let me explain this in detail...",
    "That's a great question. Here's my analysis..."
]

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
    conversation = Conversation.query.get_or_404(conv_id)
    db.session.delete(conversation)
    db.session.commit()
    return jsonify({'message': 'Conversation deleted.'})

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
        ai_content = random.choice(SAMPLE_RESPONSES)
        cache_response(user_prompt, ai_content)

    


    ai_response = Message(sender='ai', content=ai_content, conversation_id=conv_id)
    
    db.session.add(ai_response)
    db.session.commit()

    return jsonify({
        'message': 'Message sent.',
        'response': ai_content,
        'cached': cached_response is not None
    })

