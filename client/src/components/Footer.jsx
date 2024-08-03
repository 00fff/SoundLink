import React, { useState, useEffect } from 'react';
import "../Footer.css"
const Footer = (props) => {
    return(
        <div className='playlistBrick'>
            <div className='div2'>
                <img className="albumImg" src={props.img} alt={props.title} /> 
                <p className='songname'>{props.title}</p> 
            </div>
               
        </div>
        
    )
}

export default Footer;