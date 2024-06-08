import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form  } from 'react-bootstrap'; 
import { BoxArrowRight } from 'react-bootstrap-icons'; 
import { Link, Navigate } from 'react-router-dom';
import './Savings.css'; 
import Cookies from 'js-cookie';



function Savings({ username })  {
  const [savingsAmount, setSavingsAmount] = useState(null);
  const [goalAmount, setGoalAmount] = useState(null);
  const accountId = Cookies.get('accountId');


  const [transactions, setTransactions] = useState([]);
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  useEffect(() => {
    if (accountId) {
      fetch(`http://localhost:5235/accounts/${accountId}/savingsGoals`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch savings goals');
          }
        })
        .then(data => {
          if (data.length > 0) {
            const { currentSavingsBalance, goalAmount } = data[0];
            setSavingsAmount(currentSavingsBalance);
            setGoalAmount(goalAmount);
          } else {
            console.error('No savings goals found for the current account');
          }
        })
        .catch(error => {
          console.error('Error fetching savings goals:', error);
        });
    }
  }, [accountId]);
   
  useEffect(() => {
    if (accountId) {
      fetch(`http://localhost:5235/accounts/${accountId}/transactions`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch transaction history');
          }
        })
        .then(data => {
          setTransactions(data);
        })
        .catch(error => {
          console.error('Error fetching transaction history:', error);
        });
    }
  }, [accountId]);

  const handleLogout = () => {
    Cookies.remove('username');
    Cookies.remove('accountId');
    Navigate('/login');
  };
  const handleDateChange = (e) => {
    setTransactionDate(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setTransactionDescription(e.target.value);
  };

  const handleAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };


  const addTransaction = (e) => {
    e.preventDefault();
    const form = e.target;
    const date = form.date.value;
    const description = form.description.value;
    const amount = parseFloat(form.amount.value);

    if (!date || !description || isNaN(amount)) {
      console.error('Invalid input data');
      return;
    }
    const newTransaction = {
      Date: date,
      Description: description,
      Amount: amount,
      AccountId: parseInt(accountId),
    };
    console.log("new transation data: ", newTransaction);

    fetch('http://localhost:5235/newTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    })
    .then(response => {
      if (!response.ok) {
        console.error("Failed to create transaction:", response.status, response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Transaction created:', data);
      const updatedTransactions = [...transactions, data];
      setTransactions(updatedTransactions);
      setTransactionDate('');
      setTransactionDescription('');
      setTransactionAmount('');
    })
    .catch(error => {
      console.error('Error creating transaction:', error);
    });
    form.reset();
    
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
        <Col xs={2} className="text-end">
        <Link to="/login" onClick={handleLogout}>
            <Button variant="light" className="logout-button">
              <BoxArrowRight size={25} />
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="horizontal-line" />

      <Row className="container">
        <Col xs={8}>
          <div className="left-column">
            <h1 className="title">Savings</h1>
            <p className="big-number">${savingsAmount !== null ? savingsAmount : 'Loading...'}</p>
            <div className="container mt-5 p-4 rounded" style={{ backgroundColor: 'var(--light-light-blue)' }}>
            <h2 className="mb-4">Transaction History</h2>
              <div className="row mb-2">
              <div className="col-md-3 fw-bold">Date</div>
              <div className="col-md-5 fw-bold">Description</div>
              <div className="col-md-2 fw-bold">Amount</div>
              </div>
              <ul className="list-group mb-4">
                {transactions.map((transaction, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
                    <span className="transaction-description">{transaction.description}</span>
                    <span className="transaction-amount">{"$" + transaction.amount}</span>
                  </li>
                ))}
              </ul>
              <Form onSubmit={addTransaction} className="row g-3">
                <div className="col-md-3">
                  <input
                    type="date"
                    name="date"
                    value={transactionDate}
                    onChange={handleDateChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={transactionDescription}
                    onChange={handleDescriptionChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={transactionAmount}
                    onChange={handleAmountChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary w-100">+</button>
                </div>
              </Form>
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
