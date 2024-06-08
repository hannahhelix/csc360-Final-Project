import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';
import HomePage from "./Homepage";
import Budgets from './Budgets';
import Savings from './Savings';
import Account from './Account';
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [username, setUsername] = useState('');
  const [savingsAmount, setSavingsAmount] = useState(null);
  const [goalAmount, setGoalAmount] = useState(null);

  useEffect(() => {
    const loggedInUser = Cookies.get('username');
    const accountId = Cookies.get('accountId');
    const initialSavingsBalance = parseFloat(Cookies.get('savingsAmount')) || 0;
    const goalSavingsBalance = parseFloat(Cookies.get('goalAmount')) || 0;
    
    if (loggedInUser && accountId) {
      setIsLoggedIn(true);
      setUsername(loggedInUser);
      setAccountId(accountId);
      setSavingsAmount(initialSavingsBalance);
      setGoalAmount(goalSavingsBalance);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage accountId={accountId} /> : <Login setIsLoggedIn={setIsLoggedIn} setAccountId={setAccountId} />}
        />
        <Route path="/budgets" element={<Budgets />} />
        <Route 
          path="/savings"
          element={<Savings username={username} savingsAmount={savingsAmount} goalAmount={goalAmount} />} 
        />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
