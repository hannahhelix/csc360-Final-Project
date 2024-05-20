import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import "./Budgets.css"
import "./App.css"
import "./Homepage.css"


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
    // Implement form submission logic here
  };

  return (
    <Container>
      <Row>
        {/* Display current budget goals */}
        <h2 className="font-weight-bold">Current Budget Goals</h2>
        <div className="horizontal-line"/>

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
                <Button onClick={() => toggleEdit(goal.id)}>{goal.editable ? 'Save' : 'Edit'}</Button>
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
                <Button variant="primary" type="submit" className="custom-button">Create New</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Budgets;