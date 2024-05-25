import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import "./Homepage.css"
import Budgets from './Budgets';
import Savings from './Savings';
import Account from './Account';


function HomePage() {
    const budgetGoals = [
        { name: 'Food Budget', progress: 60 },
        { name: 'Rent Budget', progress: 80 },
        { name: 'Utilities Budget', progress: 50 },
      ]; 

  return (
    <div>
        <Router>
            <Routes>
            <Route path="/" element={
                <Container className="summary-container">
                <Row className="top-navigation summary-section">
                    <Col> <h2 style={{ marginBottom: '10px' }}>Weekly Summary</h2> </Col>
                    <Col xs={2} className="text-end"  >
                        <Link to="/account">
                        <Person size={35} color="Black" />
                        </Link>
                    </Col>
                    <ProgressBar now={75} className="progress-bar-custom" label="75%" />
                </Row>
                <div className="horizontal-line"/>
                <Row>
                    <Col xs={12} md={8}>
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
            } />
            <Route path="/budgets/*" element={<Budgets />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/account" element={<Account />} />

            </Routes>
        </Router>
    </div>
    );
}

export default HomePage;