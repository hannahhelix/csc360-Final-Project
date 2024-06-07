import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import "./Homepage.css"
// import Budgets from './Budgets';
// import Savings from './Savings';
// import Account from './Account';

function HomePage() {
  const [budgetGoals, setBudgetGoals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5235/budgetGoals')
      .then(response => response.json())
      .then(data => {
        setBudgetGoals(data || []);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <Container className="summary-container">
      <Row className="top-navigation summary-section">
        <Col> <h2 style={{ marginBottom: '10px' }}>Weekly Summary</h2> </Col>
        <Col xs={2} className="text-end">
          <Link to="/account">
            <Person size={35} color="Black" />
          </Link>
        </Col>
      </Row>
      <div className="horizontal-line" />
      <Row>
        <Col xs={12} md={8}>
          <h3><b>Quick Look</b></h3>
          {budgetGoals.map(goal => (
            <div key={goal.id} className="mb-3">
              <h5>{goal.title}</h5>
              <p>Goal Amount: ${goal.goalAmount}</p>
              <p>Current Amount: ${goal.currentAmount}</p>
              <ProgressBar
                now={(goal.currentAmount / goal.goalAmount) * 100}
                className="progress-bar-custom"
                label={`${goal.currentAmount} / ${goal.goalAmount}`}
                style={{ backgroundColor: 'var(--light-light-blue)' }}
              />
            </div>
          ))}
        </Col>

        <Col xs={6} md={4} className="d-flex align-items-center justify-content-center">
          <div className="buttons-container">
            <Link to="/budgets">
              <Button className="custom-button">Budgets</Button>
            </Link>
            <Link to="/savings">
              <Button className="custom-button">Savings</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;