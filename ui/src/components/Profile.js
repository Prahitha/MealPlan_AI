// src/components/Profile.js
import React from 'react';
import { auth } from './firebase';

const Profile = () => {
  const user = auth.currentUser;

  return (
    <div>
      <h2>Welcome, {user ? user.email : 'Guest'}!</h2>
      {user && <button onClick={() => auth.signOut()}>Sign Out</button>}
    </div>
  );
};

export default Profile;
