// UserList.js
import React from 'react';

const UserList = ({ names }) => (
  <div className="card">
    <p>
      {names.map((name, index) => (
        <span key={index}>{name} </span>
      ))}
    </p>
  </div>
);

export default UserList;
