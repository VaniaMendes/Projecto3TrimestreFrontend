import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';

// Mock para queryString
jest.mock('query-string', () => ({
  parse: jest.fn(),
}));

describe('ChangePasswordForm component', () => {
  test('renders password and confirm password inputs', () => {
    render(<ChangePasswordForm />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('New Password');
    
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  test('renders submit and back buttons', () => {
    render(<ChangePasswordForm />);
    
    const submitButton = screen.getByText('Change Password');
    const backButton = screen.getByText('Back');
    
    expect(submitButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test('updates password and confirm password fields on user input', () => {
    render(<ChangePasswordForm />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('New Password');
    
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });
    
    expect(passwordInput.value).toBe('newpassword');
    expect(confirmPasswordInput.value).toBe('newpassword');
  });

 

});
