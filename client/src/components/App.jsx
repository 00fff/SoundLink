// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import '../App.css';

function App() {
  const [artistInfo, setArtistInfo] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/users');
      setArtistInfo(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <UserList artistInfo={artistInfo} />
    </>
  );
}

export default App;
