from flask import Flask, jsonify, redirect, request, session
import spotipy
from PIL import Image
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from flask_cors import CORS, cross_origin
from flask_caching import Cache
import datetime
from functions import test_get_artist, get_current_playing, get_token, generate_random_string, exchange_code_for_token, getColor, iterate_nested_json_for_loop, resize
import os 
import json
import urllib.parse
# set up cache 
config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
# Initialize Flask application
app = Flask(__name__)
# set up cache instance 
app.config.from_mapping(config)
cache = Cache(app)
# Enable CORS for all origins
CORS(app, supports_credentials=True, origins="*")  
# Spotipy Set Up
app.secret_key= "uhiefhufeuihefhefuihuheif"
SPOTIPY_CLIENT_ID = "37c470559f4046088a8779c114aab3f7" #os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = "1812605664d74a9aab800538126a2815" #os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:8080/callback'
scope = "user-library-read user-read-currently-playing user-read-email playlist-read-private user-library-modify streaming"

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
    
@app.route('/callback')
def callback():
    try:
        # Get the authorization code from the query parameters
        auth_code = request.args.get('code')
        
        # Check if authorization code is present
        if not auth_code:
            return jsonify({"error": "Authorization code not found."}), 400

        # Exchange the authorization code for an access token
        token_info = auth_manager.get_access_token(auth_code, as_dict=True)

        # Check if token_info is successfully obtained
        if 'access_token' not in token_info:
            return jsonify({"error": "Failed to obtain access token."}), 400

        # Save token information to session and cache file
        session['token_info'] = token_info
        with open('.cache', 'w') as cache_file:
            json.dump(token_info, cache_file)

        # Redirect to the main page or another route
        return redirect('/')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
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
        return jsonify({"albumname": "Nothing Is Playing :(", "albumcover": "https://img.freepik.com/premium-vector/no-tv-signal-getting-signal-symbol-screen-displays-color-bars-pattern-error-message-problem-with-connection-4k-full-hd-resolutions-vector-illustration_342166-177.jpg", "artistname": "", "songname": "", "color": "(0,0,0)"}), 200

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

@app.route("/api/play", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def Play():
    print("would have played")
    # uri = request.args.get('uri')  # Retrieve the URI from query parameters
    # sp.start_playback(context_uri=uri)
    return jsonify({"message": "Succesfully Played Inputed Request"}), 200


@app.route("/api/check", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def check():
    data = read_cache()
    data = data.get("access_token")
    session["token"] = data
    return jsonify(data)

@app.route("/api/playlist", methods=["GET"])
@cross_origin(supports_credentials=True)
@cache.cached(timeout=86400)
def playlist():
    print("Fetching data from Spotify API")
    play_List = sp.current_user_playlists()
    am = len(play_List["items"])
    playlists = []

    for i in range(am):
        name = play_List["items"][i]["name"]
        images = play_List["items"][i]["images"]
        uri = play_List["items"][i]['uri']
        tracks = sp.playlist_items(uri)
        song_list = []
        if tracks is not None and 'items' in tracks:
            songs = tracks['items']
            for item in songs:
                if item.get('track') is not None and 'name' in item['track'] and item['track']['name'] is not None:
                    song = item['track']['name']
                else:
                    print("Song unable to be retrieved")
                    song = "Unknown Song"  # Provide a default value or skip appending if needed
                
                song_list.append(song)
        if images:
            img_url = images[0]["url"]
            img = resize(img_url)  # Ensure resize handles image URLs properly
        else:
            img = "client/src/assets/dpfp.png"
            #img = resize(default_img_path)  # Ensure resize handles image URLs properly
            
        playlists.append({"name": name, "url": img, "uri": uri, "songs": song_list})

    return jsonify({"playlists": playlists})

@app.route("/api/logout", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def logout():
    # Would need to delete .cache file go back to when we know how to get the login to appear again
    return jsonify("hello world")
     

    
   

    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
