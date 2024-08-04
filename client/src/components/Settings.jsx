import React, { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import "../Settings.css";

const Settings = ({ ChangeBackground }) => {
    const [showDropDown, setShowDropDown] = useState(false);

    const displayDropDown = () => {
        setShowDropDown(prevState => !prevState);
    };

    const handleBackgroundChange = (selectedBackground) => {
        ChangeBackground(selectedBackground);
    };

    return (
        <div className='settingsPage'>
            <button onClick={displayDropDown} className='BackGroundButton'>
                <p>Background Design</p>
            </button>
            {showDropDown && (
                <div className='dropdownMenu'>
                    <div className='buttons'>
                        <button onClick={() => handleBackgroundChange("geometric")}>Geometric</button>
                        <button onClick={() => handleBackgroundChange("stripes")}>Stripes</button>
                    </div>
                    
                    
                </div>
            )}
            <div className='logOut'>
                    <button><LogoutIcon /></button>
                        </div>
        </div>
    );
};

export default Settings;
