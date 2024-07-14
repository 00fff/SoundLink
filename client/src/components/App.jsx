// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UserList from './UserList';
function App() {
  const [artistInfo, setArtistInfo] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/check', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        mode: 'cors'
      });
      console.log(response.data); // Log the response data directly after setting state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      {/* <UserList artistInfo={artistInfo} /> */}
    </>
  );
}

export default App;
