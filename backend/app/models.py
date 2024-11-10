from . import db

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=db.func.now())
    messages = db.relationship('Message', backref='conversation', lazy=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(50))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=db.func.now())
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)