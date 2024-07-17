import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from "./UserList"
import Sidebar from './SideBar';

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
          const current_song = await axios.get('http://127.0.0.1:8080/api/getCurrentSong', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
            mode: 'cors',
            headers: {
              'Authorization': `Bearer ${token}` // Use the token variable here
            }
          });
          const songdata = current_song.data
          setArtistInfo(current_song.data);
          console.log(songdata)
        } catch (error) {
          console.error('Error fetching currently playing song:', error);
        }
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
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Sidebar />
      <UserList artistInfo={artistInfo} />
      
    </>
  );
}

export default App;
