from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from functions import test_get_artist, currentlyPlaying, get_token, generate_random_string, exchange_code_for_token, currentlyPlaying
import os 
import urllib.parse

# Initialize Flask application
app = Flask(__name__)
CORS(app, origins="*")  # Enable CORS for all origins
app.secret_key= os.getenv("KEY")
CLIENTID = os.getenv("CLIENTID")
SECRET = os.getenv("SECRET")
REDIRECT_URI = 'http://127.0.0.1:8080/callback'
token = get_token()
@app.route("/api/login", methods=['GET'])
def login():
    state = generate_random_string(16)
    scope = 'user-read-private user-read-email'
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
        return jsonify({"access_token": access_token}), 200
    else:
        error_message = token_response.get('error', 'Unknown error') if token_response else 'Failed to retrieve access token'
        return jsonify({"error": error_message}), 400
@app.route('/api/currentlyplaying')
def currentlyplaying():
    return


@app.route("/api/users", methods=['GET'])
def users():
    artist_info = test_get_artist("Kanye")
    return jsonify(artist_info)
    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
