from flask import Flask, jsonify
from flask_cors import CORS
from functions import test_get_artist, currentlyPlaying, get_token

# Initialize Flask application
app = Flask(__name__)
CORS(app, origins="*")  # Enable CORS for all origins
token = get_token()
@app.route("/api/currently-playing", methods=['GET'])
def get_currently_playing():
    return

@app.route("/api/users", methods=['GET'])
def users():
    artist_info = test_get_artist("Kanye")
    return jsonify(artist_info)
    
if __name__ == "__main__":
    app.run(debug=True, port=8080)
