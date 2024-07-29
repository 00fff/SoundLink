import React from "react";
import "../AlbumCard.css"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
const AlbumCard = (album) => {

    return (
        <div className="AlbumCard">
            <img src={album.album.url} alt={album.album.name} className='albumImage1' />
            <p className="albumname1">{album.album.name}</p>
            <button className="PlayButton"><PlayArrowIcon /></button>
        </div>
    )
} 

export default AlbumCard;