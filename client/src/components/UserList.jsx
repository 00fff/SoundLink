import React from 'react';
import '../Userlist.css';


const UserList = ({ artistInfo }) => (
  <div className="card">
    <p>{artistInfo.name}</p>
    <img src={artistInfo.cover} />
  </div>
);

export default UserList;
