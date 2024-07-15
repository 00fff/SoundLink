import React from 'react';
import '../Userlist.css';


const UserList = ({ artistInfo }) => (
  <div style={{ backgroundColor: `rgb(${artistInfo.color})` }} className="card">
    <p>{artistInfo.songname}</p>
    {console.log(artistInfo.color)}
    <img src={artistInfo.albumcover} />
  </div>
);

export default UserList;
