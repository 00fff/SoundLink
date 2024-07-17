// Sidebar.js
import React, { useState, useEffect } from 'react';
import '../SideBar.css';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import axios from 'axios';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
    const ToggleSideBar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar visibility
    }
  return (
    <div className="sidebar-container">
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <button className="MenuButton"onClick={ToggleSideBar}>{isOpen ? <MenuIcon /> : <CloseIcon />}</button>
    
        <ul>
        <li><a href="home"><HeadphonesIcon /></a></li>
        
        </ul>
    </div>
    
    </div>
  );
};

export default Sidebar;
