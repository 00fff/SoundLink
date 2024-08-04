from flask import Flask, jsonify, redirect, request, session
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS, cross_origin
from flask_caching import Cache
import os
import dotenv
import json
from functions import test_get_artist, get_current_playing, get_token, generate_random_string, exchange_code_for_token, getColor, iterate_nested_json_for_loop, resize
# set up cache 
config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

# Initialize Flask application
app = Flask(__name__)
dotenv.load_dotenv()
# set up cache instance 
app.config.from_mapping(config)
cache = Cache(app)

# Enable CORS for all origins
CORS(app, supports_credentials=True, origins="*")

# Spotipy Set Up
app.secret_key = "uhiefhufeuihefhefuihuheif"
SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:8080/callback'
scope = "user-library-read user-read-currently-playing user-read-email playlist-read-private user-library-modify streaming user-modify-playback-state user-read-playback-state"

# Ensure credentials are correctly loaded
if not SPOTIPY_CLIENT_ID or not SPOTIPY_CLIENT_SECRET:
    raise Exception("Spotify client ID or secret is not set in environment variables.")

# Initialize Spotify OAuth object
auth_manager = SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope=scope
)

sp = spotipy.Spotify(auth_manager=auth_manager)

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
        auth_code = request.args.get('code')
        if not auth_code:
            return jsonify({"error": "Authorization code not found."}), 400

        token_info = auth_manager.get_access_token(auth_code, as_dict=True)
        if 'access_token' not in token_info:
            return jsonify({"error": "Failed to obtain access token."}), 400

        session['token_info'] = token_info
        with open('.cache', 'w') as cache_file:
            json.dump(token_info, cache_file)

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
def play():
    uri = request.args.get('uri')  # Retrieve the URI from query parameters
    sp.start_playback(device_id="4dcf2fd96ade17f81c43f1b4c97e368928da524f", context_uri=uri, offset={'position': 0})
    return jsonify("Message Succesfully Played Inputed Request"), 200

@app.route("/api/playSong", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def playSong():
    # uri = request.args.get('uri')  # Retrieve the URI from query parameters
    # sp.start_playback(device_id="4dcf2fd96ade17f81c43f1b4c97e368928da524f", uris=[uri], offset={'position': 0})
    return jsonify("Message Succesfully Played Inputed Request"), 200

@app.route("/api/devices")
@cross_origin(supports_credentials=True)
def devices():
    devices = sp.devices()
    device = devices['devices'][0]["id"]
    return jsonify(device), 200


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
    play_list = sp.current_user_playlists()
    am = len(play_list["items"])
    playlists = []

    for i in range(am):
        name = play_list["items"][i]["name"]
        images = play_list["items"][i]["images"]
        uri = play_list["items"][i]['uri']
        
        # Fetch tracks from playlist
        tracks = sp.playlist_items(uri)
        song_list = []

        if tracks is not None and 'items' in tracks:
            songs = tracks['items']
            
            for item in songs:
                if item.get('track') is not None and 'name' in item['track'] and item['track']['name'] is not None:
                    song_name = item['track']['name']
                    
                    # Fetch album artists for each track
                    album_artists = item['track'].get('artists', [])
                    artist_names = [artist['name'] for artist in album_artists if 'name' in artist]
                    
                    song_list.append({
                        'song': song_name,
                        'artists': artist_names
                    })
                else:
                    print("Song unable to be retrieved")
                    song_list.append({
                        'song': "Unknown Song",  # Provide a default value
                        'artists': []
                    })
        
        # Handle playlist images
        if images:
            img_url = images[0]["url"]
            img = resize(img_url)  # Ensure resize handles image URLs properly
        else:
            img = "client/src/assets/dpfp.png"
            # img = resize(default_img_path)  # Ensure resize handles image URLs properly
            
        playlists.append({
            "name": name,
            "url": img,
            "uri": uri,
            "songs": song_list
        })
    
    return jsonify({"playlists": playlists})

    

@app.route("/api/volume", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def volume():
    volume = request.args.get('volume')
    if volume == "":
        return jsonify("Nah bozo")
    else:
        percent = int(volume)
        print(percent)
        volume = sp.volume(volume_percent=percent)
        return jsonify(volume)

@app.route("/api/shuffle", methods=["POST", "GET"])
@cross_origin(supports_credentials=True)
def shuffle():
    state = request.args.get('shuffle')
    if state is not None:
        state = state.lower() == 'true'
        # Assuming sp is your Spotify client instance
        sp.shuffle(state=state)
        return jsonify("Successfully shuffled"), 200
    else:
        return jsonify("Shuffle state not provided"), 400

@app.route("/api/repeat", methods=["POST", "GET"])
@cross_origin(supports_credentials=True)
def repeat():
    state = request.args.get('state')
    sp.repeat(state=state)
    return jsonify("Track Succefully Repeated", 200)
     
@app.route('/api/logout')
def logout():
    username = request.args.get('name')
    token = util.prompt_for_user_token(username, show_dialog=True)
    return redirect("/callback")

   

    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
