import React, { useState, useEffect } from 'react';
import './Account.css'; 
import Cookies from 'js-cookie';


function Account() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedInitialSavingsBalance, setEditedInitialSavingsBalance] = useState('');
  const [editedGoalSavingsBalance, setEditedGoalSavingsBalance] = useState('');

  useEffect(() => {
    const accountId = Cookies.get('accountId'); // Assuming you are using the 'js-cookie' library
    if (accountId) {
      fetch(`http://localhost:5235/accounts/${accountId}`)
        .then((response) => response.json())
        .then((data) => {
          setAccountInfo(data);
          setEditedUsername(data.username);
          setEditedInitialSavingsBalance(data.initialSavingsBalance);
          setEditedGoalSavingsBalance(data.goalSavingsBalance);
        })
        .catch((error) => console.error('Error fetching account data:', error));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const editedInfo = {
      id: accountInfo.id,
      username: editedUsername,
      initialSavingsBalance: editedInitialSavingsBalance,
      goalSavingsBalance: editedGoalSavingsBalance,
    };

    fetch(`/accounts/${editedInfo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        setAccountInfo(data);
        setIsEditing(false);
      })
      .catch((error) => console.error('Error updating account data:', error));
  };

  if (!accountInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-container">
      <h2>Account Information</h2>
      <div className="account-field">
        <label>Username:</label>
        {isEditing ? (
          <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
        ) : (
          <span>{accountInfo.username}</span>
        )}
      </div>
      <div className="account-field">
        <label>Initial Savings Balance:</label>
        {isEditing ? (
          <input type="number" value={editedInitialSavingsBalance} onChange={(e) => setEditedInitialSavingsBalance(e.target.value)} />
        ) : (
          <span>{accountInfo.initialSavingsBalance}</span>
        )}
      </div>
      <div className="account-field">
        <label>Goal Savings Balance:</label>
        {isEditing ? (
          <input type="number" value={editedGoalSavingsBalance} onChange={(e) => setEditedGoalSavingsBalance(e.target.value)} />
        ) : (
          <span>{accountInfo.goalSavingsBalance}</span>
        )}
      </div>
      {isEditing ? (
        <button onClick={handleSave} className="save-button">Save</button>
      ) : (
        <button onClick={handleEdit} className="edit-button">Edit</button>
      )}
    </div>
  );
}

export default Account;
