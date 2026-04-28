from celery import Celery
from celery.utils.log import get_task_logger
from app.config import settings
import json


app = Celery('tasks', broker='redis://localhost:6379//')

logger = get_task_logger(__name__)

@app.task
def add(x, y):
    print(f'sum is: {x+y}')


@app.task
def otp_task(username,otp):
    if settings.ENV == 'dev':
        logger.info(f'Hello {username}! Your otp code is:{otp}')



@app.task
def save_messages(batch):
    pass

