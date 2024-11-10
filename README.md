# cmpe273-hackathon

## Demo Video
You can see the demo video [here](https://drive.google.com/file/d/1bmobOqiOJMbP-QL545LIhCoeTK5OOuGU/view?usp=sharing)

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # Configure your environment variables
flask db upgrade
python run.py
```


### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Development Setup

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173






