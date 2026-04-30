## Note

This project is primarily built to **practice backend development skills**.  
The frontend may **not be fully optimized** for user experience or performance.

---

## FastAPI + React Real-Time Chat Application
A real-time one-to-one chat application that supports WebSocket-based messaging, cursor-based pagination, Redis caching, and background task processing via Celery. The system uses a normalized database schema with Socket.io rooms for live delivery of messages between users.

---

## Key Features

- Real-time one-to-one messaging via WebSocket (Socket.io)
- Cursor-based pagination for efficient message history retrieval
- JWT-based authentication(Access token and Refresh token)
- RESTful API with full async support
- Redis caching
- Background tasks processing using Celery
- Alembic for data migration
- SQLAlchemy for async database CRUD operations and optimized ORM models

---

## Tech Stack
### Backend
- Fastapi
- SQLAlchemy (async)
- Alembic
- Redis
- Celery
- SocketIO server
- Postgresql / SQLite

### Frontend
- React
- SocketIO client
- Tailwind CSS

---

## Initial Setup
### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL / SQLite
- Redis

### Backend
1. Clone the repo

   ```bash
   git clone https://github.com/user/repo.git
  
2. Navigate to backend directory
   
   ```bash
     cd backend
3. Create and activate virtual environment

   ```bash
   python -m venv venv
   linux: source venv/bin/activate
   windows: venv\Scripts\activate

4. Install dependencies

    ```bash
    pip install -r requirements.txt

5. Create .env file(it is optional, the proejct will work without this but only for testing purpose. Default database is SQLite) and define these variables

   ```bash
   DATABASE_URL=your database url e.g (postgresql+asyncpg://<username>:<password>@<host>:<port>/>database name>)
   ALEMBIC_DB_URL=your same database url but without driver e.g (postgresql://<username>:<password>@<host>:<port>/>database name>)
   SECRET_KEY=your secret key for encoding and deconding jwt
   ALGORITHM=your algorithm for encoding and decoding jwt

6. Run database migrations

   ```bash
   if you are using postgresql, then run these commands in order:
   alembic upgrade +1
   alembic upgrade +1 (yes same command two times)

   if you are using default database(SQLite), then:
   delete both .py files in migrations/versions directory
   
   run these commands in order:
   alembic revision --autogenerate -m ""
   alembic upgrade head

7. Start the fastapi server

   ```bash
   uvicorn app.main:sio_asgi

8. [Optional] Start the Celery worker (in a separate terminal)

   ```bash
   celery -A app.core.celery_app worker --loglevel=INFO

   Note that the project will work fine without celery
   because right now celery is only printing verification
   code in terminal. the same code will also be printed
   in fastapi terminal as well

Note: Make sure your terminal is in "backend" directory in order to all of above commands to work properly

## Frotend

1. Navigate to frontend directory

   ```bash
   cd frontend

2. Install dependencies

   ```bash
   npm i

3. Start the development server

   ```bash
   npm run dev

---

## Backend Routes

Base url: http://localhost:8000

### Authentication

prefix=/auth

| URL | Method | Description |
|-----|--------|------------|
|/login| POST | It accepts email and password in json body, authenticates user, returns {token:<access_toke>} and sets refresh token in cookies|
|/regiser| POST | It accepts RegiserModel(defined in schemas.auth.py) parameters in json body, creates user if user does not exist, returns {token:<access_toke>} and sets refresh token in cookies|
|/logout| POST | It logs out user using access token sent with request, blocks that jwt token and removes refresh token from cookies |
|/refresh | POST | This route generates new access and refresh token if refresh token sent with cookies is valid |
|/is-verified | GET | This route verfies if access token user is verified or not|
|/generate-otp | POST | Generates otp for access token user, stores it in redis(for 5 minutes) |
|/verify-user | POST | Verifies the otp sent by access token user(in json body), updates user in database to be verified |

### API

Note: this route is proected, all the endpoints will only work if access token is valid or else it will raise http execetpion.

prefix=/api


| URL | Method | Description |
|-----|--------|------------|
|/u | GET | Returns data(UserOut schema model) for requested access token user. |
|/conversations | GET | Returns all other users data with their last message for the requested access token user |
|/conversations/{conv_id} | GET | Returns all messages(in cursor pagination) and last message cursor for url parameter conv id |
|/conv-user/{conv_id} | GET | Returns username for the provided url parameter conv id |
|/create-conversation/{user_id} | POST | Creates conversation between access token user and url parameter provided user |
|/delete-conv/{conv_id} | POST | Deletes conversation between between access token user and url parameter provided conv id |
