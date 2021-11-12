from os.path import join, dirname
import os
import boto3
from dotenv import load_dotenv

# Environmental variables
dotenv_path = join(dirname(__file__), '.env.ea')
load_dotenv(dotenv_path)

ACCESS_KEY_ID = os.environ.get("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.environ.get("SECRET_ACCESS_KEY")
REGION_NAME = os.environ.get("REGION_NAME")
PROJECT_BUCKET = os.environ.get("PROJECT_BUCKET")
PROJECT_CRYPTOGRAPHIC_KEY = os.environ.get("PROJECT_CRYPTOGRAPHIC_KEY")

# Initialize client for fleek storage
s3 = boto3.client(
    service_name='s3',
    endpoint_url='https://storageapi.fleek.co',
    aws_access_key_id = ACCESS_KEY_ID,
    aws_secret_access_key = SECRET_ACCESS_KEY,
    region_name = REGION_NAME
)

request = s3.list_objects_v2(
    Bucket=PROJECT_BUCKET,
    MaxKeys=20
)

initial_data = []
for content in request['Contents']:
    initial_data.append((content['Key'], content['ETag']))


file = 'automated_solution_used_for_progress_evaluation copy.py'
try:
    request = s3.put_object(
        Bucket = PROJECT_BUCKET,
        Key = f'enc_{file}',
        ContentType = file,
        Body = open(f'../input_data_used_for_valuation/enc_{file}', 'rb'),
        ACL = 'private'
    )
except Exception as e:
    print(e)