import React, { useState, useEffect } from 'react';

const SongCard = (prop) => {

    return (
        <div>
    <p>{prop.name} by {prop.artistnames}</p>
            </div>
        
    )
}

export default SongCard