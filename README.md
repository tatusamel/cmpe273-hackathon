# cmpe273-hackathon

### Group Members
Anthony Vann : 013208962
Nisarg Prajapati : 018202626
Serhat Gundem : 018183828

### Demo Video
You can see the demo video [here](https://drive.google.com/file/d/1bmobOqiOJMbP-QL545LIhCoeTK5OOuGU/view?usp=sharing)

### Collab File 
This file is where we turn the pages into images and we embed each image into an index. `Hackathon.ipynb`


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






