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
|/users/?query=<username>| GET | Returns 10 matched users with given username |


### SocketIO Server

Base url=http://localhost:8000

NameSpace=/chat

| EVENT | Description |
|-----|------------|
|on_connect| Verifies request using access token sent by client in auth body e.g (io(url/namespace,{auth:token{<access_token>}})), joins the sid in room with same user_id and sets user_id in redis with sid|
|on_disconnect | Disconnects sid and deletes sid from redis |
|on_create_conv_session| Creates temporary conv_id by authenticating conversation one time, stores in redis,joins sid in that authenticate conv id and then temp conv id will be used for sending messages |
|on_send_message | Broadcasts message to conv id and user id room by checking if temp conv id is correct |

---

## Frontend Routes

Base url=http://localhost:5173

### Public Routes

These routes will work if user is not authenticated

| URL | Method | Description |
|-----|--------|------------|
|/ | PAGE | Login page. Sends request to "/login" in backend route using axios, if authenticated then it will store access and refresh token and redirects user to Private '/' route |
|/register | PAGE | Register page, sends request to "/register" in background route with user inputs, if register success, then redirects to Private "/otp" route for user to verify itself |


### Private Routes
| URL | Method | Description |
|-----|--------|------------|
| / | PAGE | Home page, sends requests to "/u","/conversations" and connects to socketio namespace "/chat" |
|/users | PAGE | Users page, here user can search for other user by giving usernames of other users, it uses debounce to send request to "/users/?query<user_input>". User can start conversation with others from here |
|/chats | PAGE | Dummy page
|/profile | PAGE | Profile page, only logout but is functional right now |
|/otp | PAGE | Otp page, it verifies user by otp genrated by backend |
|/conversations/:id | PAGE | Messagebox page, if the current user exist in the conversation, then it will fetch messages using cursor pagination and user will be able to send message to other user using socketio events |
