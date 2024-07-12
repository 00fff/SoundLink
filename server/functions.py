import requests
from flask import jsonify
from requests import post, get
from dotenv import load_dotenv
import os
import base64
import string
import random
# Load environment variables
load_dotenv()
CLIENTID = os.getenv("CLIENTID")
SECRET = os.getenv("SECRET")
REDIRECT_URI = 'http://127.0.0.1:8080/callback'
def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))
def exchange_code_for_token(code):
    url = 'https://accounts.spotify.com/api/token'
    headers = {
        'Authorization': 'Basic ' + base64.b64encode(f"{CLIENTID}:{SECRET}".encode('utf-8')).decode('utf-8')
    }
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to exchange code for token: {response.status_code} {response.text}")
        return None

def get_token():
    auth_string = CLIENTID + ":" + SECRET
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    
    if result.status_code == 200:
        json_result = result.json()
        token = json_result['access_token']
        
        return token
    else:
        print(f"Failed to retrieve access token: {result.text}")
        return None

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def currentlyPlaying(token):
    return


def get_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    params = {
        "q": artist_name,
        "type": "artist",
        "limit": 1
    }
    result = get(url, headers=headers, params=params)
    
    if result.status_code == 200:
        json_result = result.json()
        return json_result
    else:
        print(f"Failed to fetch artist data: {result.text}")
        return None

# Test function to fetch artist info
def test_get_artist(artist_name):
    token = get_token()
    if token:
        artist_data = get_artist(token, artist_name)
        if artist_data:
            name = artist_data["artists"]["items"][0]["name"]
            cover = artist_data["artists"]["items"][0]["images"][1]["url"]
            return {"name": name, "cover": cover}
        else:
            print("Failed to fetch artist data.")
            return None
    else:
        print("Failed to obtain access token.")
        return None
