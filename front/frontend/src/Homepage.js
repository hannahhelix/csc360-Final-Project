import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import "./Homepage.css"
import Budgets from './Budgets';
import Savings from './Savings';

function HomePage() {
    const budgetGoals = [
        { name: 'Food Budget', progress: 60 },
        { name: 'Rent Budget', progress: 80 },
        { name: 'Utilities Budget', progress: 50 },
      ]; 

  return (
    <Router>
        <Routes>
        <Route path="/" element={
            <Container className="summary-container">
            <Row className="summary-section">
                <Col xs={12}>
                <h2>Weekly Summary</h2>
                <ProgressBar now={75} className="progress-bar-custom" label="75%" />
                </Col>
            </Row>
            <div className="horizontal-line"/>
            <Row>
                <Col md={8}>
                <h3><b>Quick Look</b></h3>
                {budgetGoals.map((goal, index) => (
                    <div key={index} className="mb-3">
                    <h5>{goal.name}</h5>
                    <ProgressBar 
                        now={goal.progress} 
                        className="progress-bar-custom" 
                        label={`${goal.progress}%`} 
                        style={{backgroundColor: 'var(--light-light-blue)'}}
                    />
                    </div>
                ))}
                </Col>
                <Col md={4} className="d-flex justify-content-end">
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
        } />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/savings" element={<Savings />} />
        </Routes>
    </Router>
    );
}

export default HomePage;