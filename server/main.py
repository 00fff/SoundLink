from flask import Flask, jsonify, redirect, request, session
import spotipy
from PIL import Image
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from flask_cors import CORS, cross_origin
import datetime
from functions import test_get_artist, get_current_playing, get_token, generate_random_string, exchange_code_for_token, getColor, iterate_nested_json_for_loop
import os 
import json
import urllib.parse
# Initialize Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")  # Enable CORS for all origins
app.secret_key= os.getenv("KEY")
SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:8080/callback'
scope = "user-library-read user-read-currently-playing user-read-email"

# Initialize Spotify OAuth object
auth_manager = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope=scope
)

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

def read_cache():
    try:
        with open('.cache', 'r') as cache_file:
            data = json.load(cache_file)
            return data
    except FileNotFoundError:
        return {}

@app.route("/api/getCurrentSong", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def getCurrentSong():
    currently_playing_data  = sp.current_user_playing_track()
    if currently_playing_data and currently_playing_data['is_playing']:
        albumname = currently_playing_data["item"]["album"]["name"]
        albumcover = currently_playing_data["item"]["album"]["images"][0]["url"]
        artistname = currently_playing_data["item"]["artists"][0]["name"]
        songname = currently_playing_data["item"]["name"]
        color = getColor(albumcover)
        return jsonify({"albumname": albumname, "albumcover": albumcover, "artistname": artistname, "songname": songname, "color": color}), 200
        
    else:
        return jsonify({"error": "No track is currently playing"}), 400

@app.route("/api/next_song", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def NextSong():
    sp.next_track()  # Skips to the next track
    return jsonify({"message": "Skipped to the next song"}), 200

@app.route("/api/last_song", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def LastSong():
    sp.previous_track()
    return jsonify({"message": "Skipped to the previous song"}), 200



@app.route("/api/check", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def check():
     data = read_cache()
     data = data.get("access_token")
     return jsonify(data)

@app.route("/api/playlist", methods=["GET"])
@cross_origin(supports_credentials=True)
def playlist():
    play_List = sp.current_user_playlists()
    am = len(play_List["items"])
    names = []
    
    for i in range(am):
        name = play_List["items"][i]["name"]
        names.append(name)
    
    return jsonify({"playlists": names})
    
   

    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
