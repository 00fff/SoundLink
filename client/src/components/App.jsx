import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import UserList from "./UserList"
import Sidebar from './SideBar';
import PlayList from './Playlist';

function App() {
  const [artistInfo, setArtistInfo] = useState([]);
  const [accessToken, setAccessToken] = useState();
  const [lastPlayed, setLastPlayed] = useState([]);


  useEffect(() => {
    console.log(accessToken); // This will log the updated accessToken whenever it changes
  }, [accessToken]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/check', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        mode: 'cors'
      });

      const token = response.data;
      setAccessToken(token);

      if (token) {
      try {
        // Fetch current song information using the access token
        const current_song = await axios.get('http://127.0.0.1:8080/api/getCurrentSong', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token}` // Use the token variable here
          }
        });

        const songdata = current_song.data;
        setArtistInfo(songdata); // Update artistInfo state with song data
        console.log(songdata);
      } catch (error) {
        console.error('Error fetching currently playing song:', error);
      }
    } else {
      console.log('Token does not exist or is invalid');
      // Handle the case where token doesn't exist or is invalid
      // For example, set some default state or handle the error conditionally
    }
  } catch (error) {
    console.error('Error fetching data:', error);
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

  return (
    <>
    <Sidebar />
    <BrowserRouter>
    
      <Routes>
        <Route index element={<UserList artistInfo={artistInfo} />} />
        <Route path="/home" element={<UserList artistInfo={artistInfo} />} />
        <Route path="/playlist" element={<PlayList />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
