import React, { useState } from 'react';
import '../Playlist.css';
import { css } from '@emotion/react';

const PlayList = ({ playlist }) => {
    const [cState, setCstate] = useState(false);

    // Handle button click to toggle state
    const onClick = (index) => {
        setCstate(!cState);
        console.log(index); // Log the index of the clicked button
        console.log(cState)
    };

    return (
        <div className={`playlistScreen ${cState ? 'active' : ''}`}>

            <h1 className='Title'>My Playlist</h1>
            <div className='playlists'>
                {playlist.map((item, index) => (
                    <button 
                        key={index}
                        onClick={() => onClick(index)} // Pass a function reference
                        className='playlistbutton'
                    >
                        <div className='playlistItem'>
                            <img src={item.url} alt={item.name} className='albumImage' />
                            <p className='albumName'>{item.name}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PlayList;
