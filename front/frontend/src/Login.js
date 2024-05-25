import React, { useState } from 'react';

const Login = ({ onLogin, onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [initialSavingsBalance, setInitialSavingsBalance] = useState('');
  const [goalSavingsBalance, setGoalSavingsBalance] = useState('');
  const [budgetGoal, setBudgetGoal] = useState('');

  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic HTTP authentication logic goes here
    // For demonstration, let's assume the login is successful
    const userInfo = {
      username,
      // you can hash the password for security
      // but for this example, let's keep it simple
      password,
      initialSavingsBalance,
      goalSavingsBalance,
      budgetGoal
    };
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      onSignUp(userInfo);
    } else {
      onLogin({ username, password });
    }
  };

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {isSignUp && (
          <div>
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        )}
        {isSignUp && (
          <div>
            <label>Initial Savings Balance:</label>
            <input type="number" value={initialSavingsBalance} onChange={(e) => setInitialSavingsBalance(e.target.value)} />
          </div>
        )}
        {isSignUp && (
          <div>
            <label>Goal Savings Balance:</label>
            <input type="number" value={goalSavingsBalance} onChange={(e) => setGoalSavingsBalance(e.target.value)} />
          </div>
        )}
        {isSignUp && (
          <div>
            <label>Budget Goal:</label>
            <input type="text" value={budgetGoal} onChange={(e) => setBudgetGoal(e.target.value)} />
          </div>
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Back to Login' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default Login;
