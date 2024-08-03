import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import UserList from "./UserList";
import Sidebar from './SideBar';
import PlayList from './Playlist';
import Settings from './Settings';
import '../index.css';
function App() {
  const [artistInfo, setArtistInfo] = useState([]);
  const [accessToken, setAccessToken] = useState();
  const [playlist, setPlaylist] = useState([]); // Added state for playlist
  const [showControls, setShowControls] = useState(true);


  useEffect(() => {
    console.log(accessToken); // This will log the updated accessToken whenever it changes
  }, [accessToken]);

  const fetchAPI = async () => {
    try {
        // Fetch access token
        const response = await axios.get('http://127.0.0.1:8080/api/check', {
            method: 'GET',
            withCredentials: true, // Include cookies in the request
        });
        const token = response.data;
        setAccessToken(token);

        if (token) {
            try {
              
                // Fetch current song information
                const current_song = await axios.get('http://127.0.0.1:8080/api/getCurrentSong', {
                    method: 'GET',
                    withCredentials: true, // Include cookies in the request
                    headers: {
                        'Authorization': `Bearer ${token}` // Use the token variable here
                    },
                    credentials: 'include'  // This allows cookies to be sent with the request
                });
                const songdata = current_song.data;
                setArtistInfo(songdata); // Update artistInfo state with song data

                

            } catch (error) {
                console.error('Error fetching song or playlist data:', error);
                // Optionally handle cases where no current song is playing
                setArtistInfo(null); // Reset artistInfo if needed
            }
            try{
              // Fetch playlist information
              const playlistResponse = await axios.get('http://127.0.0.1:8080/api/playlist', {
                method: 'GET',
                withCredentials: true, // Include cookies in the request
                headers: {
                    'Authorization': `Bearer ${token}` // Correctly use the token variable here
                }
            });
            console.log(playlistResponse.data.playlists)
            
            setPlaylist(playlistResponse.data.playlists); // Update playlist state with playlist data
            } catch {
              console.error('Error fetching song or playlist data:', error);
            }
        } else {
            console.log('Token does not exist or is invalid');
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

  useEffect(() => {
    // Polling interval
    const interval = setInterval(() => {
      fetchAPI();
    }, 5000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const HudControls = () => {
    setShowControls(!showControls)
  }
  return (
    <>
      <Sidebar HudControls={HudControls}/>
      <BrowserRouter>
        <Routes>
          <Route index element={<UserList artistInfo={artistInfo} showControls={showControls}/>} />
          <Route path="/home" element={<UserList artistInfo={artistInfo} />} />
          <Route path="/playlist" element={<PlayList playlist={playlist} artistInfo={artistInfo} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
