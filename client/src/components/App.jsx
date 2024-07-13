// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import '../App.css';
function App() {
  const [artistInfo, setArtistInfo] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  let token = "BQA4PxeDesRx3YuQysvtlAepPfXppovws7X1LdWCUxWlZMXLjXoWEagy5j1bpeEW5R7YHIVPClklP7sfLFFQVlnA1sDcyxP96pkH_0at2lXD33sfWCQQ4Vx2B-VxOtl0XQ9n8CM_Mle1rei0feOKIYu4w1xX_UE9-t95YW7FTmEt_mqfqsb_KTZJufePPBaqn7c7CVGo_8SZ6lU0Kg"
  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/currently_playing', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
        },
      });console.log(response)
      setArtistInfo(response.data);
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
      <UserList artistInfo={artistInfo} />
    </>
  );
}

export default App;
