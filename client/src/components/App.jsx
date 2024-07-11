// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import '../App.css';

function App() {
  const [count, setCount] = useState(0);
  const [names, setNames] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/users');
      setNames(response.data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <UserList names={names} />
    </>
  );
}

export default App;
