import React, { useState } from 'react';
import { Form, FormGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Authenticate = (e, setIsLoggedIn, setAccountId, savingsAmount, goalAmount) => {
  e.preventDefault();
  const username = e.target.elements.username.value; 
  fetch('http://localhost:5235/login', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + e.target.elements.password.value)
    },
    body: JSON.stringify(
      { 
          username: username,
          password: e.target.elements.password.value,
          savingsAmount: savingsAmount,
          goalAmount: goalAmount
      }
    )
  })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(data => {
      data = JSON.parse(data); 
      Cookies.set('username', username, { expires: 7 });
      Cookies.set('accountId', data.accountId, { expires: 7 });
      Cookies.set('savingsAmount', data.initialSavingsBalance, { expires: 7 });
      Cookies.set('goalAmount', data.goalSavingsBalance, { expires: 7 });
      // console.log(data);
      setIsLoggedIn(true);
      setAccountId(data.accountId);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
};

const NewUser = (e, setIsLoggedIn, setAccountId) => {
  const username = e.target.elements.new_username.value; 
  const initialSavingsBalance = parseFloat(e.target.elements.initial_savings_balance.value);
  const goalSavings = parseFloat(e.target.elements.goal_savings_balance.value);
  fetch('http://localhost:5235/newUser', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: e.target.elements.new_password.value,
      initialSavingsBalance: initialSavingsBalance,
      goalSavingsBalance: goalSavings,
      budgetGoalTitle: e.target.elements.budget_goal_title.value,
      budgetGoalAmount: parseFloat(e.target.elements.budget_goal_amount.value),
      budgetGoalDescription: e.target.elements.budget_goal_description.value,
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    data = JSON.parse(data); 
    Cookies.set('username', username, { expires: 7 });
    Cookies.set('accountId', data.accountId, { expires: 7 });
    Cookies.set('savingsAmount', data.initialSavingsBalance, { expires: 7 });
    Cookies.set('goalAmount', data.goalSavingsBalance, { expires: 7 });
    setIsLoggedIn(true);
    setAccountId(data.accountId);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
};

function Login({ setIsLoggedIn }) {
  // const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [accountId, setAccountId] = useState(null);

  return (
    <div className="container">
      <div className="form-container">
        {isSignUp ? (
          <>
            <h2>Sign Up</h2>
            <Form onSubmit={(e) => NewUser(e, setIsLoggedIn, setAccountId)}>
              <FormGroup className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="new_username" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="new_password" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirm_password" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Initial Savings Balance</Form.Label>
                <Form.Control type="number" step="0.01" name="initial_savings_balance" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Goal Savings Balance</Form.Label>
                <Form.Control type="number" step="0.01" name="goal_savings_balance" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Budget Goal Title</Form.Label>
                <Form.Control type="text" name="budget_goal_title" required />
              </FormGroup>
               <FormGroup className='mb-3'>
                <Form.Label>Budget Goal Description</Form.Label>
                <Form.Control type="text" name="budget_goal_description" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Budget Goal Amount</Form.Label>
                <Form.Control type="number" step="0.01" name="budget_goal_amount" required />
              </FormGroup>
              <Button variant='primary' type="submit" className="w-100">Sign Up</Button>
            </Form>
            <br />
            <Button variant='secondary' className="w-100" onClick={() => setIsSignUp(false)}>
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <Form onSubmit={(e) => Authenticate(e, setIsLoggedIn, setAccountId)}>
              <FormGroup className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" required />
              </FormGroup>
              <FormGroup className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" required />
              </FormGroup>
              <Button variant='primary' type="submit" className="w-100">Login</Button>
            </Form>
            <br />
            <Button variant='secondary' className="w-100" onClick={() => setIsSignUp(true)}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
