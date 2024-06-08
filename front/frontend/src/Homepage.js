import React, { useState, useEffect } from 'react';
import {Link, Navigate } from 'react-router-dom';
import { Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import Cookies from 'js-cookie';
import "./Homepage.css"


function HomePage({ accountId }) {
  const [budgetGoals, setBudgetGoals] = useState([]);

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


  const handleLogout = () => {
    Cookies.remove('username');
    Cookies.remove('accountId');
    Navigate('/login');
  };

  return (
    <Container className="summary-container">
      <Row className="top-navigation summary-section">
        <Col> <h2 style={{ marginBottom: '10px' }}>Weekly Summary</h2> </Col>
        <Col xs={2} className="text-end">
        <Link to="/login" onClick={handleLogout}>
            <Button variant="light" className="logout-button">
              <BoxArrowRight size={25} />
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="horizontal-line" />
      <Row>
        <Col xs={12} md={8}>
          <h3><b>Quick Look</b></h3>
          {budgetGoals.slice(0, 2).map(goal => (
          <div key={goal.id} className="mb-3">
            <h5>{goal.title}</h5>
            <p>Goal Amount: ${goal.goalAmount}</p>
            <p>Current Amount: ${goal.currentAmount}</p>
            <ProgressBar
              now={(goal.currentAmount / goal.goalAmount) * 100}
              className="progress-bar-custom"
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