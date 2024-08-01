// Import React library (required for JSX)
import React, { useState } from 'react';
import axios from 'axios';
import Volume from "./Volume";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import '../Userlist.css';
import { red } from '@mui/material/colors';

// Functional component definition for UserList
const UserList = ({ artistInfo, showControls }) => {
  const [shuffleState, setShuffleState] = useState(false)
  const nextSong = async () => {
    try {
      const skipSong = await axios.get("http://127.0.0.1:8080/api/next_song", {
        method: 'GET',
        withCredentials: true, // Include cookies in the request
      });
      console.log('Skipped to the next song:', skipSong.data);
    } catch (error) {
      console.error('Error skipping to the next song:', error);
    }
  };

  const lastSong = async () => {
    try {
      const pastSong = await axios.get("http://127.0.0.1:8080/api/last_song", {
        method: 'GET',
        withCredentials: true, // Include cookies in the request
      });
      console.log('Skipped to the last song:', pastSong.data);
    } catch (error) {
      console.error('Error skipping to the last song:', error);
    }
  };
  const switchShuffle = async (state) => {
    try {
      const pastSong = await axios.get("http://127.0.0.1:8080/api/shuffle", {
        params: {shuffle: state},
        method: 'GET',
        withCredentials: true, // Include cookies in the request
      });
      console.log('Skipped to the last song:', pastSong.data);
    } catch (error) {
      console.error('Error skipping to the last song:', error);
    }
  };

  const ChangeShuffle = () => {
    setShuffleState(!shuffleState)
    switchShuffle(shuffleState)
    
  }
  return (
    <div className="card" style={{ backgroundColor: `rgb(${artistInfo.color})` }}>
      <div className="content">
        <img src={artistInfo.albumcover} alt="Album Cover" className="album-cover" />
        
        {showControls && (
          <div className="control-buttons">
            <button className="skipbuttons" onClick={lastSong}>
              <ArrowBackIosNewIcon />
            </button>
            <button className="skipbuttons" onClick={nextSong}>
              <ArrowForwardIosIcon />
            </button>
          </div>
        )}
        <div className="text">
          <p>{artistInfo.songname}</p>
          <p>{artistInfo.artistname}</p>
          <p>{artistInfo.albumname}</p>
        </div>
        
        {showControls && (<div className='volumeControl'>
        <Volume />
        <button  onClick={ChangeShuffle} className='Shuffle'>{shuffleState === false ? <ShuffleOnIcon /> : <ShuffleIcon />}</button>
        </div>)}
      </div>
    </div>
  );
};

// Export the UserList component as the default export
export default UserList;
