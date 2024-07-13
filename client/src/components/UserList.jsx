import React from 'react';
import '../Userlist.css';


const UserList = ({ artistInfo }) => (
  <div className="card">
    <p>{artistInfo.songname}</p>
    <img src={artistInfo.albumcover} />
  </div>
);

export default UserList;
