import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap'; 
import { Person } from 'react-bootstrap-icons'; 
import { Link } from 'react-router-dom';
import './Savings.css'; 
import Cookies from 'js-cookie';



function Savings({username}) {
  const [savingsAmount, setSavingsAmount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goalAmount, setGoalAmount] = useState(null);

  const [transactionDate, setTransactionDate] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');


  const initialSavingsBalance = Cookies.get('initialSavingsBalance');
  const goalSavings = Cookies.get('goalSavings');


  useEffect(() => {
    console.log('Initial Savings Balance:', initialSavingsBalance);
    console.log('Goal Savings:', goalSavings);
    setSavingsAmount(initialSavingsBalance);
    setGoalAmount(goalSavings);
  }, []);


  const handleDateChange = (e) => {
    setTransactionDate(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setTransactionDescription(e.target.value);
  };

  const handleAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };

  const addTransaction = () => {
    if (transactionDate && transactionDescription && transactionAmount) {
      const newTransaction = {
        date: transactionDate,
        description: transactionDescription,
        amount: parseFloat(transactionAmount) // Convert amount to number
      };

      // Make a POST request to your backend endpoint
      fetch('http://localhost:5235/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle response from the backend if needed
        console.log('Transaction added:', data);
      })
      .catch(error => {
        console.error('Error adding transaction:', error);
      });

      // Update local state
      setTransactions([...transactions, newTransaction]);
      setTransactionDate('');
      setTransactionDescription('');
      setTransactionAmount('');
    }
  };



  return (
    <div className="container">
      <Row className="align-items-center top-navigation">
        <Col xs={2}>
          <Link to="/">
            <Button variant="primary" className="back-button">&#8592; Home</Button>
          </Link>
        </Col>
        <Col xs={8}>
          <h2 className="font-weight-bold">Savings Goals</h2>
        </Col>
        <Col xs={1} className="text-end">
          <Link to="/account">
            <Person size={35} color="Black" />
          </Link>
        </Col>
        <div className="horizontal-line" />
      </Row>

      <Row className="container">
        <Col xs={8}>
          <div className="left-column">
          <h1 className="title">Savings</h1>
            <p className="big-number">${savingsAmount !== null ? savingsAmount : 'Loading...'}</p>
            <div className="transaction-list">
            <h2>Transaction History</h2>
              <ul>
                {transactions.map((transaction, index) => (
                  <li key={index}>
                    <span className="transaction-date">{transaction.date}</span>
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-amount">{"$" +transaction.amount}</span>
                  </li>
                ))}
              </ul>
            <div className="add-transaction">
              <input
                type="date"
                value={transactionDate}
                onChange={handleDateChange}
              />
              <input
                type="text"
                placeholder="Description"
                value={transactionDescription}
                onChange={handleDescriptionChange}
              />
               <input
                type="number"
                placeholder="Amount"
                value={transactionAmount}
                onChange={handleAmountChange}
              />
              <button className="plus-button" onClick={addTransaction}>+</button>
            </div>
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="right-column">
            <h1 className="title">Goal Amount</h1>
            <p className="big-number">${goalAmount !== null ? goalAmount : 'Loading...'}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Savings;
