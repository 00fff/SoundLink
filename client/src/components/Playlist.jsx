import React, { useState } from 'react';
import AlbumCard from './AlbumCard';
import '../Playlist.css';

const PlayList = ({ playlist }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // Handle button click to toggle state
    const handleClick = (index) => {
        // Toggle selection
        if (selectedPlaylist === index) {
            setSelectedPlaylist(null); // Deselect if the same item is clicked again
        } else {
            setSelectedPlaylist(index);
        }
    };

    // Determine if the overlay should be active
    const isActive = selectedPlaylist !== null;

    return (
        <div>
            {selectedPlaylist !== null && (
                <div>
                    <AlbumCard album={playlist[selectedPlaylist]} />
                </div>
            )}
        <div className={isActive ? "playlistScreenDarkOverlay" : "playlistScreen"}>
            <h1 className='Title'>My Playlist</h1>
            
            <div className='playlists'>
                {playlist.map((item, index) => (
                    <button 
                        key={index}
                        onClick={() => handleClick(index)} // Correctly pass the index
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
        </div>

    );
}

export default PlayList;
