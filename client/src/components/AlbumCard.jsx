import React from "react";
import SongCard from "./SongCard";
import "../AlbumCard.css"
import axios from "axios";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
const AlbumCard = (album) => {
    const songs = album.album.songs
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
            <div className="SongBox">
            <ul>
                {songs.map(song => (
                    <li className="songs" key={song}><SongCard name={song}/></li>
                ))}
            </ul>
            </div>
        </div>
    )
} 

export default AlbumCard;