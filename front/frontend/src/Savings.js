import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap'; 
import { Person } from 'react-bootstrap-icons'; 
import { Link } from 'react-router-dom';
import './Savings.css'; 

function Savings() {
  // State for savings amount
  const [savingsAmount, setSavingsAmount] = useState(2000.05);

  // State for transaction history
  const [transactions, setTransactions] = useState([]);

  // State for transaction input fields
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');

  // Function to add a new transaction
  const addTransaction = () => {
    if (transactionDate && transactionDescription) {
      const newTransaction = {
        date: transactionDate,
        description: transactionDescription
      };
      setTransactions([...transactions, newTransaction]);
      setTransactionDate('');
      setTransactionDescription('');
    }
  };

  // Function to handle changes in transaction date input
  const handleDateChange = (e) => {
    setTransactionDate(e.target.value);
  };

  // Function to handle changes in transaction description input
  const handleDescriptionChange = (e) => {
    setTransactionDescription(e.target.value);
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
            <p className="big-number">${savingsAmount.toFixed(2)}</p>
            <div className="transaction-list">
            <h2>Transaction History</h2>
              <ul>
                {transactions.map((transaction, index) => (
                  <li key={index}>
                    <span className="transaction-date">{transaction.date}</span>
                    <span className="transaction-description">{transaction.description}</span>
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
              <button classname="plus-button" onClick={addTransaction}>+</button>
            </div>
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="right-column">
            <h1 className="title">Goal Amount</h1>
            <p className="big-number">$5,000</p>
            <h4 className="progress">Progress:</h4>
            {/* Implement your progress tracker component here */}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Savings;
