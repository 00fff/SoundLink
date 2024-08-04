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
  const [playlist, setPlaylist] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [changedBackground, setBackground] = useState("geometric");

  useEffect(() => {
    console.log("Access Token:", accessToken);
  }, [accessToken]);

  

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/check', {
        method: 'GET',
        withCredentials: true,
      });
      const token = response.data;
      setAccessToken(token);

      if (token) {
        try {
          const current_song = await axios.get('http://127.0.0.1:8080/api/getCurrentSong', {
            method: 'GET',
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });
          const songdata = current_song.data;
          setArtistInfo(songdata);

        } catch (error) {
          console.error('Error fetching song or playlist data:', error);
          setArtistInfo(null);
        }

        try {
          const playlistResponse = await axios.get('http://127.0.0.1:8080/api/playlist', {
            method: 'GET',
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setPlaylist(playlistResponse.data.playlists);
        } catch (error) {
          console.error('Error fetching playlist data:', error);
        }
      } else {
        console.log('Token does not exist or is invalid');
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAPI();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const HudControls = () => {
    setShowControls(!showControls);
  };

  const ChangeBackground = (background) => {
    localStorage.setItem("BackGround", background);
};


  return (
    <>
      <Sidebar HudControls={HudControls} />
      <BrowserRouter>
        <Routes>
          <Route index element={<UserList artistInfo={artistInfo} showControls={showControls}/>} />
          <Route path="/home" element={<UserList artistInfo={artistInfo} showControls={showControls} />} />
          <Route path="/playlist" element={<PlayList playlist={playlist} artistInfo={artistInfo} />} />
          <Route path="/settings" element={<Settings ChangeBackground={ChangeBackground} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
