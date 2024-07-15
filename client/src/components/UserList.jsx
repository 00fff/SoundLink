// Import React library (required for JSX)
import React from 'react';

// Import CSS file for styling
import '../Userlist.css';

// Functional component definition for UserList
const UserList = ({ artistInfo }) => (
  <div className="card" style={{ backgroundColor: `rgb(${artistInfo.color})` }}>
    <div className="content">
      <img src={artistInfo.albumcover} alt="Album Cover" className="album-cover" />
      <div className="text">
        <p>{artistInfo.songname}</p>
        <p>{artistInfo.artistname}</p>
        <p>{artistInfo.albumname}</p>
      </div>
    </div>
  </div>
);

// Export the UserList component as the default export
export default UserList;
