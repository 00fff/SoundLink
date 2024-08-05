SoundLink

SoundLink is a web application that provides seamless control over Spotify playback. It allows users to play, pause, adjust volume, and navigate through their Spotify playlists with ease. The application is built with React for the frontend and Flask for the backend.
Features

    Play and Pause Tracks: Control Spotify playback directly from the app.
    Volume Adjustment: Change the volume of the currently playing track.
    Track Information: Display the current track's details and album art.
    Playlist Navigation: Browse and select playlists from your Spotify account.

Technologies Used

    React: Frontend framework for building the user interface.
    Flask: Backend framework for handling server-side logic.
    Spotify API: For integrating music playback and playlist features.

Getting Started
Prerequisites

    Node.js and npm
    Python 3
    Spotify Developer Account

Installation

    Clone the repository:

bash

git clone https://github.com/0fff/SoundLink.git
cd SoundLink

    Set up the backend:
        Navigate to the server directory:

    bash

cd server

    Create a virtual environment:

bash

python3 -m venv venv
source venv/bin/activate

    Install dependencies:

bash

pip install -r requirements.txt

Set up the frontend:

    Navigate to the client directory:

bash

cd ../client

    Install dependencies:

bash

npm install

Set up Spotify credentials:

    Export your Spotify credentials as environment variables:

bash

export SPOTIFY_CLIENT_ID=your_spotify_client_id
export SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
export SPOTIFY_REDIRECT_URI=http://localhost:5000/callback

Start the backend server:

    In the server directory:

bash

flask run

Start the frontend development server:

    In the client directory:

bash

    npm run dev

Usage

Once both the frontend and backend servers are running, open your browser and navigate to http://localhost:5173 to access the SoundLink application. You will be prompted to log in with your Spotify account to grant the necessary permissions.
Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
