from app import create_app
import redis

app = create_app()

if __name__ == "__main__":
    app.run(host='localhost', port=5001)
