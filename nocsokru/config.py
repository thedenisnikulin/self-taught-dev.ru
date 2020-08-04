import os
from os import path
from dotenv import load_dotenv

dotenv_path = path.join(path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.environ.get('DATABASE_URL')

DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_PORT = os.environ.get('DB_PORT')

QIWI_SECRET = os.environ.get('QIWI_SECRET')
QIWI_THEME_CODE = os.environ.get('QIWI_THEME_CODE')