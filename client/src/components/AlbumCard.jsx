import React from "react";
import SongCard from "./SongCard";
import "../AlbumCard.css";
import axios from "axios";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

const AlbumCard = ({ album, handler, songinfo }) => {
    const { songs, url, name, uri } = album;

    const close = () => {
        handler();
    };

    const PlayPlaylist = async () => {
        try {
            await axios.get("http://127.0.0.1:8080/api/play", {
                params: { uri: uri }, // Pass the URI as a query parameter
                method: 'GET',
                withCredentials: true, // Include cookies in the request
            });
        } catch (error) {
            console.error('Error skipping to the next song:', error);
        }
    };
    const PlaySong = async () => {
        console.log(songinfo)
        // try {
        //     // Make a GET request to the Flask API to start playback
        //     await axios.get("http://127.0.0.1:8080/api/playSong", {
        //         params: { uri: uri }, // Pass the URI as a query parameter
        //         method: 'GET',
        //         withCredentials: true, // Include cookies in the request
        //     });
        //     console.log('Playback started successfully.');
        // } catch (error) {
        //     // Handle errors and log them to the console
        //     console.error('Error starting playback:', error);
        // }
    };
    return (
        <div className="AlbumCard">
            <button onClick={close} className="closeButton"><CloseIcon /></button>
            <img src={url} alt={name} className='albumImage1' />
            <p className="albumname1">{name}</p>
            <button onClick={PlayPlaylist} className="PlayButton"><PlayArrowIcon /></button>
            <div className="SongBox">
                <ul>
                    {songs.map(song => (
                        <li className="songs" key={song}><SongCard name={song} /> 
                        </li>
                        // <button onClick={PlaySong} className="songButton"><PlayArrowIcon /></button></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlbumCard;
