import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Person } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import "./Budgets.css";
import "./App.css";
import "./Homepage.css";
import Account from './Account';



function Budgets() {

  const [goals, setGoals] = useState([
    { id: 1, title: 'Food Budget', description: 'Budget for groceries', amount: 500, progress: 250, editable: false },
    { id: 2, title: 'Rent Budget', description: 'Monthly rent expenses', amount: 1000, progress: 800, editable: false },
    { id: 3, title: 'Utilities Budget', description: 'Budget for utilities bills', amount: 200, progress: 150, editable: false },
  ]); 

  const toggleEdit = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, editable: !goal.editable };
      }
      return goal;
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const amount = parseInt(form.amount.value);
  
    const newGoal = {
      id: goals.length + 1,
      title,
      description,
      amount,
      progress: 0,
      editable: false,
    };
  
    setGoals([...goals, newGoal]);
    form.reset();
  };

  return (
    
    <Container style={{marginTop: '20px'}}>
      
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
            <Link to="/account">
              <Person size={35} color="Black" />
            </Link>
          </Col>
          <div className="horizontal-line" />
        </Row>

      <Row className="container">
        <Col md={9}>
          {goals.map((goal) => (
            <div key={goal.id} className="mb-3">
              <h4>{goal.title}</h4>
              <p>{goal.description}</p>
              <ProgressBar 
                now={(goal.progress / goal.amount) * 100} 
                className="progress-bar-custom" 
                label={`${goal.progress} / ${goal.amount}`}
                variant="custom"
              />
              <div className="mt-2">
                  <Button onClick={() => toggleEdit(goal.id)} className='edit-button'  variant="none">{goal.editable ? 'Update Progress' : 'Edit'}</Button>
              </div>
            </div>
          ))}
        </Col>

        {/* Create new budget goal form */}
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
                <Form.Control type="number" placeholder="Enter amount" required />
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