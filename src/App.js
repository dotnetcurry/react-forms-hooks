import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  minMaxLength,
  validEmail,
  passwordStrength,
  userExists,
} from './validations';

function App() {
  let [user, setUser] = useState({});
  let [formErrors, setFormErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = { ...formErrors };

    switch (name) {
      case 'firstName':
        if (minMaxLength(value, 3)) {
          currentFormErrors[
            name
          ] = `First Name should have minimum 3 characters`;
        } else {
          delete currentFormErrors[name];
        }
        break;
      case 'lastName':
        if (minMaxLength(value, 3)) {
          currentFormErrors[
            name
          ] = `Last Name should have minimum 3 characters`;
        } else {
          delete currentFormErrors[name];
        }
        break;
      case 'email':
        if (!value || validEmail(value)) {
          currentFormErrors[name] = `Email address is invalid`;
        } else {
          userExists(value).then((result) => {
            if (result) {
              currentFormErrors[name] =
                'The email is already registered. Please use a different email.';
            } else {
              delete currentFormErrors[name];
            }
          });
        }
        break;
      case 'password':
        if (minMaxLength(value, 6)) {
          currentFormErrors[name] = 'Password should have minimum 6 characters';
        } else if (passwordStrength(value)) {
          currentFormErrors[name] =
            'Password is not strong enough. Include an upper case letter, a number or a special character to make it strong';
        } else {
          delete currentFormErrors[name];
          setUser({
            ...user,
            password: value,
          });
          if (user.confirmpassword) {
            validateConfirmPassword(
              value,
              user.confirmpassword,
              currentFormErrors
            );
          }
        }
        break;
      case 'confirmpassword':
        let valid = validateConfirmPassword(
          user.password,
          value,
          currentFormErrors
        );
        if (valid) {
          setUser({ ...user, confirmpassword: value });
        }
        break;
      default:
        break;
    }

    setFormErrors(currentFormErrors);
    setUser({ ...user, [name]: value });
  }

  function validateConfirmPassword(
    password,
    confirmpassword,
    formErrors
  ) {
    formErrors = formErrors || {};
    if (password !== confirmpassword) {
      formErrors.confirmpassword =
        'Confirmed password is not matching with password';
      return false;
    } else {
      delete formErrors.confirmpassword;
      return true;
    }
  }

  function submit(e) {
    e.preventDefault();
    console.log(user);
  }

  return (
    <div className='App container col-6'>
      <h3>New User Registration Form</h3>
      <ul>
        {Object.entries(formErrors || {}).map(([prop, value]) => {
          return (
            <li className='error-message' key={prop}>
              {value}
            </li>
          );
        })}
      </ul>
      <form onSubmit={submit} noValidate>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='firstName'>First Name</label>
            <input
              className={
                formErrors && formErrors.firstName
                  ? 'form-control error'
                  : 'form-control'
              }
              placeholder='First Name'
              type='text'
              name='firstName'
              noValidate
              onBlur={handleChange}
            />
          </div>
          <div className='col-md-6'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              className={
                formErrors && formErrors.lastName
                  ? 'form-control error'
                  : 'form-control'
              }
              placeholder='Last Name'
              type='text'
              name='lastName'
              noValidate
              onBlur={handleChange}
            />
          </div>
        </div>

        <div className='mb-3'>
          <label htmlFor='email'>Email</label>
          <input
            className={
              formErrors && formErrors.email
                ? 'form-control error'
                : 'form-control'
            }
            placeholder='Email'
            type='email'
            name='email'
            noValidate
            onBlur={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='password'>Password</label>
          <input
            className={
              formErrors && formErrors.password
                ? 'form-control error'
                : 'form-control'
            }
            placeholder='Password'
            type='password'
            name='password'
            noValidate
            onBlur={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='confirmpassword'>Confirm Password</label>
          <input
            className={
              formErrors && formErrors.confirmpassword
                ? 'form-control error'
                : 'form-control'
            }
            placeholder='Password'
            type='password'
            name='confirmpassword'
            noValidate
            onBlur={handleChange}
          />
        </div>
        <div className='mb-3'>
          <button
            type='submit'
            disabled={Object.entries(formErrors || {}).length > 0}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
