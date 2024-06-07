import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Person } from 'react-bootstrap-icons';
import './Budgets.css';
import Account from './Account';

function Budgets() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5235/budgetGoals')
      .then(response => response.json())
      .then(data => setGoals(data))
      .catch(error => console.error('Error fetching budget goals:', error));
  }, []);

  const toggleEdit = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, editable: !goal.editable };
      }
      return goal;
    }));
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    const form = e.target;
    const updatedAmount = parseFloat(form.updatedAmount.value);

    fetch(`http://localhost:5235/budgetGoals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentAmount: updatedAmount }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const updatedGoals = goals.map(goal => {
          if (goal.id === id) {
            return { ...goal, currentAmount: updatedAmount };
          }
          return goal;
        });
        setGoals(updatedGoals);
      })
      .catch(error => {
        console.error('Error updating budget goal:', error);
      });

    form.reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const amount = parseFloat(form.amount.value);

    const newGoal = {
      title: title,
      description: description,
      goalAmount: amount,
      currentAmount: 0,
      editable: false
    };

    fetch('http://localhost:5235/budgetGoals', {
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
        const updatedGoals = [...goals, data];
        setGoals(updatedGoals);
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
              <h4 className="goal-title">{goal.title}</h4>
              <p className="goal-description">{goal.description}</p>
              <ProgressBar 
                now={(goal.currentAmount / goal.goalAmount) * 100} 
                className="progress-bar-custom" 
                label={`${goal.currentAmount} / ${goal.goalAmount}`}
                variant="custom"
              />
              <div className="mt-2">
                {goal.editable ? (
                  <Form onSubmit={(e) => handleUpdate(e, goal.id)}>
                    <Form.Group controlId="updatedAmount">
                      <Form.Control type="number" step="0.01" placeholder="Enter updated amount" required />
                    </Form.Group>
                    <Button type="submit" variant="primary">Update</Button>
                  </Form>
                ) : (
                  <Button onClick={() => toggleEdit(goal.id)} className='edit-button' variant="none">Edit</Button>
                )}
              </div>
            </div>
          ))}
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
