import React from 'react';
import '../Userlist.css';


const UserList = ({ artistInfo }) => (
  <div className="card">
    <p>{artistInfo.artist}</p>
    <img src={artistInfo.album} />
  </div>
);

export default UserList;
