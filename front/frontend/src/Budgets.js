import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar, ButtonGroup } from 'react-bootstrap';
import {Routes, Route, Link, Navigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import './Budgets.css';
import Account from './Account';
import Cookies from 'js-cookie';


function Budgets() {
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [currentAmounts, setCurrentAmounts] = useState(
    budgetGoals.reduce((acc, goal) => ({ ...acc, [goal.id]: goal.currentAmount }), {})
  );
  const accountId = Cookies.get('accountId');

  useEffect(() => {
    const accountId = Cookies.get('accountId');
    fetch(`http://localhost:5235/accounts/${accountId}/budgetGoal`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch budget goals');
        }
      })
      .then(data => {
        setBudgetGoals(data);
      })
      .catch(error => {
        console.error('Error fetching budget goals:', error);
      });
  }, []);

  useEffect(() => {
    const initialAmounts = budgetGoals.reduce((acc, goal) => ({ ...acc, [goal.id]: goal.currentAmount }), {});
    setCurrentAmounts(initialAmounts);
  }, [budgetGoals]);

  const incrementAmount = async (goalId, increment) => {
    try {
      if (increment < 0 && currentAmounts[goalId] + increment < 0) {
        return; 
      }
      const response = await fetch(`http://localhost:5235/budgetGoals/${goalId}/increment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(increment),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const updatedGoal = await response.json();
      setCurrentAmounts(prevAmounts => ({
        ...prevAmounts,
        [goalId]: updatedGoal.currentAmount
      }));
    } catch (error) {
      console.error('Error incrementing amount:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('username');
    Cookies.remove('accountId');
    Navigate('/login');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const goalAmount = parseFloat(form.amount.value);
    const currentAmount = 0;
  
    if (!title || !goalAmount || isNaN(goalAmount)) {
      console.error('Invalid input data');
      return;
    }
  
    const newGoal = {
      Title: title,
      Description: description,
      GoalAmount: goalAmount,
      CurrentAmount: currentAmount,
      AccountId: accountId,
    };
  
    fetch('http://localhost:5235/newBudgetGoal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoal),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Budget goal created:', data);
      const updatedGoals = [...budgetGoals, data];
      setBudgetGoals(updatedGoals);
    })
    .catch(error => {
      console.error('Error creating budget goal:', error);
    });
  
    form.reset();
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Row className="align-items-center top-navigation">
        <Col xs={2}>
          <Link to="/">
            <Button variant="primary" className="back-button">&#8592; Home</Button>
          </Link>
        </Col>
        <Col xs={8}>
          <h2 className="font-weight-bold">Current Budget Goals</h2>
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
      <Col md={9}>
          {budgetGoals.map((goal) => {
            const isComplete = currentAmounts[goal.id] >= goal.goalAmount;

            return (
              <div key={goal.id} className="mb-3">
                <h4 className="goal-title">{goal.title}</h4>
                <p>Description: {goal.description}</p>
                <p>Goal Amount: ${goal.goalAmount}</p>
                <p>
                  {isComplete ? 'Complete' : `Current Amount: $${currentAmounts[goal.id]}`}
                </p>
                <ProgressBar 
                  now={(currentAmounts[goal.id] / goal.goalAmount) * 100} 
                  className="progress-bar-custom" 
                  variant="custom"
                />
                <div className="mt-2">
                  <ButtonGroup>
                    <Button onClick={() => incrementAmount(goal.id, -1)} variant="danger">-</Button>
                    <Button onClick={() => incrementAmount(goal.id, 1)} variant="success">+</Button>
                  </ButtonGroup>
                </div>
              </div>
            );
          })}
        </Col>
  
        <Col md={3}>
          <div className="createNew-container">
            <h2 className="mb-4 font-weight-bold">Create New</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter description" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Goal Amount ($)</Form.Label>
                <Form.Control type="number" step="0.01" placeholder="Enter amount" required />
              </Form.Group>
              <Button variant="primary" type="submit" className="small-create-button">Create New</Button>
            </Form>
          </div>
        </Col>
      </Row>
      <Routes>
        <Route path="/account" element={<Account />} />
      </Routes>
    </Container>
  );
}

export default Budgets;
