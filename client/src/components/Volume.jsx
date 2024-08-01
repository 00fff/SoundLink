import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../volume.css";

const Volume = () => {
    const [inputValue, setInputValue] = useState(50); // Default to 50, can be adjusted

    const handleInputChange = (event) => {
        const value = Number(event.target.value);
        setInputValue(value); // Update state with the new value
    };
    
    const FixVolume = (value) => {
        console.log("fix Volume" + value)
    }

    const ChangeVolume = async (value) => {
        try {
            await axios.get('http://127.0.0.1:8080/api/volume', {
                params: { volume: value },
                method: 'GET',
                withCredentials: true, // Include cookies in the request
            });
        } catch (error) {
            console.error('Error changing volume:', error);
        }
    };

    useEffect(() => {
        // Polling interval to continuously update volume
        const interval = setInterval(() => {
            ChangeVolume(inputValue); // Use inputValue to update volume
        }, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [inputValue]); // Dependency array to re-run effect when inputValue changes

    return (
        <div className='volumeBox'>
            
            <input
                className="volumeBar"
                type="range"
                min="0"
                max="100"
                value={inputValue} // Controlled input
                onChange={handleInputChange}
                onMouseUp={() => ChangeVolume(inputValue)}
                onTouchEnd={() => ChangeVolume(inputValue)}
            />
        </div>
    );
};

export default Volume;
