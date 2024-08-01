// Sidebar.js
import React, { useState, useEffect } from 'react';
import '../SideBar.css';
import { BrowserRouter, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import Switch from '@mui/material/Switch';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

const Sidebar = ({ HudControls }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
    const [SwitchState, setSwitchState] = useState(true);
    const ToggleSideBar = () => {
        setIsOpen(!isOpen); // Toggle the sidebar visibility
    }
  const onChange = () => {
    HudControls()
  }
  return (
    <div className="sidebar-container">
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <button className="MenuButton" onClick={ToggleSideBar}>{isOpen ? <CloseIcon /> : <MenuIcon />}</button>
    <ul className="sidebar-links">
    <BrowserRouter>
    <li className='homebutton'>
    <button><Link reloadDocument to="/"style={{ textDecoration: 'none', color: 'black'}}><HeadphonesIcon /></Link></button>
    </li>
    <li className='playlist'>
        <button ><Link reloadDocument to="/playlist"style={{ textDecoration: 'none', color: 'black'}}><QueueMusicIcon /></Link></button>
    </li>
    <li className='switch'>
      <p align="center">HUD</p>
      <Switch onChange={onChange} defaultChecked />
    </li>
    <li className='settings'>
        <button><Link reloadDocument to="/settings"style={{ textDecoration: 'none', color: 'black'}}><SettingsIcon /></Link></button>
    </li>
    </BrowserRouter>
    </ul>
    </div>
    </div>
  );
};

export default Sidebar;
