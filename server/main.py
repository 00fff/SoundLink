from flask import Flask, jsonify, redirect, request, session
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from flask_cors import CORS, cross_origin
import datetime
from functions import test_get_artist, get_current_playing, get_token, generate_random_string, exchange_code_for_token
import os 
import urllib.parse
# Initialize Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")  # Enable CORS for all origins
app.secret_key= os.getenv("KEY")
SPOTIPY_CLIENT_ID = os.getenv("CLIENTID")
SPOTIPY_CLIENT_SECRET = os.getenv("SECRET")
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:8080/callback'
scope = "user-library-read user-read-currently-playing user-read-email"
auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))



@app.route("/api/getCurrentSong", methods=["GET", "POST"])
def getCurrentSong():
    currently_playing_data  = sp.current_user_playing_track()
    if currently_playing_data and currently_playing_data['is_playing']:
        albumname = currently_playing_data["item"]["album"]["name"]
        albumcover = currently_playing_data["item"]["album"]["images"][0]["url"]
        artistname = currently_playing_data["item"]["artists"][0]["name"]
        songname = currently_playing_data["item"]["name"]

        return jsonify({"albumname": albumname, "albumcover": albumcover, "artistname": artistname, "songname": songname}), 200
    else:
        return jsonify({"error": "No track is currently playing"}), 400

"""@app.route("/api/login", methods=['GET'])
@cross_origin(supports_credentials=True)
def login():
    state = generate_random_string(16)
    scope = 'user-read-currently-playing user-read-email'
    params = {
        'response_type': 'code',
        'client_id': CLIENTID,
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'state': state
    }
    spotify_auth_url = 'https://accounts.spotify.com/authorize?' + urllib.parse.urlencode(params)
    return redirect(spotify_auth_url)
@app.route('/callback')
def callback():
    code = request.args.get('code')
    state = request.args.get('state')
    token_response = exchange_code_for_token(code)
    
    if token_response and 'access_token' in token_response:
        access_token = token_response['access_token']
        # Optionally, store access_token in session or database
        session['access_token'] = access_token
        response =  jsonify({"access_token": access_token}), 200
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        error_message = token_response.get('error', 'Unknown error') if token_response else 'Failed to retrieve access token'
        return jsonify({"error": error_message}), 400
    


@app.route('/api/currently_playing', methods=['GET', 'POST'])
@cross_origin(methods=['GET', 'POST'], supports_credentials=True)
def currently_playing():
    access_token = session.get('access_token')
    if not access_token:
        return jsonify({"error": "No access token available"}), 401

    currently_playing_data = get_current_playing(access_token)
    if currently_playing_data:
        albumname = currently_playing_data["item"]["album"]["name"]
        albumcover = currently_playing_data["item"]["album"]["images"][0]["url"]
        artistname = currently_playing_data["item"]["album"]["artists"][0]["name"]
        songname = currently_playing_data["item"]["name"]
        response = jsonify({"albumname": albumname, "albumcover": albumcover, "artistname": artistname, "songname": songname}), 200
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response 
    else:
        return jsonify({"error": "Failed to fetch currently playing data"}), 400

@app.route("/api/access_token", methods=['GET'])
def access_token():
    token = session.get('access_token')
    return jsonify({"key": token})
@app.route("/api/users", methods=['GET'])
def users():
    artist_info = test_get_artist("Kanye")
    return jsonify(artist_info)"""
    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
