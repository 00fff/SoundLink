import React, { useState } from 'react';
import AlbumCard from './AlbumCard';
import '../Playlist.css';

const PlayList = ({ playlist }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const handleClick = (index) => {
        console.log("hello world");
        setSelectedPlaylist(selectedPlaylist === index ? null : index);
    };

    const isActive = selectedPlaylist !== null;

    return (
        <div>
            {selectedPlaylist !== null && (
                <div>
                    <AlbumCard album={playlist[selectedPlaylist]} handler={() => handleClick(null)} />
                </div>
            )}
            <div className={isActive ? "playlistScreenDarkOverlay" : "playlistScreen"}>
                <h1 className='Title'>My Playlist</h1>
                <div className='playlists'>
                    {playlist.map((item, index) => (
                        <button 
                            key={index}
                            onClick={() => handleClick(index)}
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
};

export default PlayList;
