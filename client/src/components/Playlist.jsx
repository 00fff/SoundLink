import React from 'react';
import '../Playlist.css';

const PlayList = ({ playlist }) => {

    const onClick = () => {
        console.log("Hello World")
    }
    return (
        <div className='playlistScreen'>
            <h1 className='Title'>My Playlist</h1>
    <div className='playlists'>
        
        {playlist.map((item, index) => (
                    <button onClick={onClick} className='playlistbutton'><div key={index} className='playlistItem'>
                        <img src={item.url} alt={item.name} className='albumImage' />
                        <p className='albumName'>{item.name}</p>

                    </div></button>
                ))}
    </div>        
        </div>
    );
}

export default PlayList;
