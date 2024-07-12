import requests
from requests import post, get
from dotenv import load_dotenv
import os
import base64

# Load environment variables
load_dotenv()
CLIENTID = os.getenv("CLIENTID")
SECRET = os.getenv("SECRET")
REDIRECT_URI = 'http://127.0.0.1:8080/callback'

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
