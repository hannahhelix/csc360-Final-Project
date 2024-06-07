import React, { useState } from 'react';
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <HomePage /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/savings" element={<Savings />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
