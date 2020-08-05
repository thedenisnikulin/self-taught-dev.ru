import os
from os import path
from dotenv import load_dotenv

dotenv_path = path.join(path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.environ.get('DATABASE_URL')

QIWI_DEFAULT_AMOUNT = os.environ.get('QIWI_DEFAULT_AMOUNT')
QIWI_SECRET = os.environ.get('QIWI_SECRET')
QIWI_THEME_CODE = os.environ.get('QIWI_THEME_CODE')