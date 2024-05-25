import React, { useState } from 'react';

function Account({ username, initialSavingsBalance, goalSavingsBalance, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedInitialSavingsBalance, setEditedInitialSavingsBalance] = useState(initialSavingsBalance);
  const [editedGoalSavingsBalance, setEditedGoalSavingsBalance] = useState(goalSavingsBalance);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save edited information
    const editedInfo = {
      username: editedUsername,
      initialSavingsBalance: editedInitialSavingsBalance,
      goalSavingsBalance: editedGoalSavingsBalance
    };
    // Call the onEdit function passed from the parent component
    onEdit(editedInfo);
    setIsEditing(false);
  };

  return (
    <div>
      <h2>Account Information</h2>
      <div>
        <label>Username:</label>
        {isEditing ? (
          <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
        ) : (
          <span>{username}</span>
        )}
      </div>
      <div>
        <label>Initial Savings Balance:</label>
        {isEditing ? (
          <input type="number" value={editedInitialSavingsBalance} onChange={(e) => setEditedInitialSavingsBalance(e.target.value)} />
        ) : (
          <span>{initialSavingsBalance}</span>
        )}
      </div>
      <div>
        <label>Goal Savings Balance:</label>
        {isEditing ? (
          <input type="number" value={editedGoalSavingsBalance} onChange={(e) => setEditedGoalSavingsBalance(e.target.value)} />
        ) : (
          <span>{goalSavingsBalance}</span>
        )}
      </div>
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}

export default Account;
