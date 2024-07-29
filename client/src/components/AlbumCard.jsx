import React from "react";
import "../AlbumCard.css"
import axios from "axios";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
const AlbumCard = (album) => {
    const PlayPlaylist = async (uri) => {
        try {
            const playPlaylist = await axios.get("http://127.0.0.1:8080/api/play", {
            params: { uri: uri }, // Pass the URI as a query parameter
            method: 'GET',
            withCredentials: true, // Include cookies in the request
            });
        } catch (error) {
            console.error('Error skipping to the next song:', error);
        }
    };
    return (
        <div className="AlbumCard">
            <img src={album.album.url} alt={album.album.name} className='albumImage1' />
            <p className="albumname1">{album.album.name}</p>
            <button onClick={PlayPlaylist(album.album.uri)}className="PlayButton"><PlayArrowIcon /></button>
        </div>
    )
} 

export default AlbumCard;