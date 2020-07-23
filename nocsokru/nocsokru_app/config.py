import os
from os import path
from dotenv import load_dotenv

dotenv_path = path.join(path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

QIWI_SECRET = os.environ.get('QIWI_SECRET')