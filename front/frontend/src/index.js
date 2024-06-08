import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';
import HomePage from "./Homepage";
import Budgets from './Budgets';
import Savings from './Savings';
import Login from "./Login";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const loggedInUser = Cookies.get('username');
    const accountId = Cookies.get('accountId');
    
    if (loggedInUser && accountId) {
      setIsLoggedIn(true);
      setUsername(loggedInUser);
      setAccountId(accountId);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage accountId={accountId} /> : <Login setIsLoggedIn={setIsLoggedIn} setAccountId={setAccountId} />}/>
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setAccountId={setAccountId} />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);

reportWebVitals();
