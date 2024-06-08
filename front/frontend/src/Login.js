import React, { useState } from 'react';
import { Form, FormGroup, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Authenticate = (e, setIsLoggedIn, setAccountId, savingsAmount, goalAmount) => {
  e.preventDefault();
  const username = e.target.elements.username.value; 
  const password = e.target.elements.password.value;
  fetch('http://localhost:5235/login', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + password)
    },
    body: JSON.stringify({ 
          username: username,
          password: password,
          savingsAmount: savingsAmount,
          goalAmount: goalAmount
      }
    )
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(data => {
      // data = JSON.parse(data); 
      Cookies.set('auth', data, { expires: 7 });
      Cookies.set('username', username, { expires: 7 });
      Cookies.set('accountId', data.accountId, { expires: 7 });
      Cookies.set('savingsAmount', data.initialSavingsBalance, { expires: 7 });
      Cookies.set('goalAmount', data.goalSavingsBalance, { expires: 7 });
      setIsLoggedIn(true);
      setAccountId(data.accountId);
      window.location.href = '/';
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
};

const NewUser = (e, setIsLoggedIn, setAccountId) => {
  e.preventDefault(); 
  const username = e.target.elements.new_username.value;
  const password = e.target.elements.new_password.value;
  const initialSavingsBalance = parseFloat(e.target.elements.initial_savings_balance.value);
  const goalSavingsBalance = parseFloat(e.target.elements.goal_savings_balance.value);
  const budgetGoalTitle = e.target.elements.budget_goal_title.value;
  const budgetGoalDescription = e.target.elements.budget_goal_description.value;
  const budgetGoalAmount = parseFloat(e.target.elements.budget_goal_amount.value);

  fetch('http://localhost:5235/newUser', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      initialSavingsBalance: initialSavingsBalance,
      goalSavingsBalance: goalSavingsBalance,
      budgetGoalTitle: budgetGoalTitle,
      budgetGoalAmount: budgetGoalAmount,
      budgetGoalDescription: budgetGoalDescription,
    })
  })
  .then(response => response.json())
  .then(data => {
    Cookies.set('username', username, { expires: 7 });
    Cookies.set('accountId', data.accountId, { expires: 7 });
    Cookies.set('savingsAmount', data.initialSavingsBalance, { expires: 7 });
    Cookies.set('goalAmount', data.goalSavingsBalance, { expires: 7 });
    setIsLoggedIn(true);
    setAccountId(data.accountId);
    window.location.href = '/';
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
};

function Login({ setIsLoggedIn }) {
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
