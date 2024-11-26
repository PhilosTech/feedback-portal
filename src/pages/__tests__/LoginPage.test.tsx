import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage'; 

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginPage Component', () => {
  it('renders all elements correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Welcome to the User Feedback Portal')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please enter your credentials below to log in and share your feedback. We value your input to make our services better.'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('handles user input correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('navigates to /feedback on successful login', () => {
    const mockNavigate = jest.fn();
    jest.mocked(require('react-router-dom').useNavigate).mockImplementation(
      () => mockNavigate
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/feedback');
    expect(localStorage.getItem('token')).toBe('token');
  });

  it('displays correct text and styles for forgot password and create account links', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const forgotPassword = screen.getByText('Forgot password?');
    const createAccount = screen.getByText('Create an account');

    expect(forgotPassword).toBeInTheDocument();
    expect(forgotPassword).toHaveStyle('color: #1976d2; cursor: pointer;');
    expect(createAccount).toBeInTheDocument();
    expect(createAccount).toHaveStyle('color: #1976d2; cursor: pointer;');
  });
});
