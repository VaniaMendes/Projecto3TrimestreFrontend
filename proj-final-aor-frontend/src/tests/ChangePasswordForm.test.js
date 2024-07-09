import { render, screen, fireEvent } from '@testing-library/react';
import ChangePasswordForm from './ChangePasswordForm';
import * as userService from '../../services/users'; // Importe o módulo de serviços

// Mock do serviço resetPassword
jest.mock('../../services/users', () => ({
  resetPassword: jest.fn().mockResolvedValue(200), // Mock da função resetPassword
}));

test('handles form submission with valid password and matching confirm password', async () => {
  // Renderiza o componente ChangePasswordForm
  render(<ChangePasswordForm />);

  // Preenche os campos de senha e confirmação de senha
  const passwordInput = screen.getByLabelText(/password/i);
  const confirmPasswordInput = screen.getByLabelText(/newPassword/i);
  fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

  // Submete o formulário
  const submitButton = screen.getByText(/changePassword/i);
  fireEvent.click(submitButton);

  // Assert que a função resetPassword foi chamada com os argumentos corretos
  expect(userService.resetPassword).toHaveBeenCalledWith(
    expect.any(String), // resetPassToken
    'Test123!', // password
    'Test123!' // confirmPassword
  );

  // Assert que a mensagem de toast de sucesso é exibida
  const successToast = await screen.findByText(/passwordResetSuccess/i);
  expect(successToast).toBeInTheDocument();
});

test('handles form submission with invalid password', async () => {
  // Renderiza o componente ChangePasswordForm
  render(<ChangePasswordForm />);

  // Preenche os campos de senha e confirmação de senha com senha inválida
  const passwordInput = screen.getByLabelText(/password/i);
  const confirmPasswordInput = screen.getByLabelText(/newPassword/i);
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

  // Submete o formulário
  const submitButton = screen.getByText(/changePassword/i);
  fireEvent.click(submitButton);

  // Assert que a mensagem de toast de erro para senha inválida é exibida
  const errorToast = await screen.findByText(/invalidPassword/i);
  expect(errorToast).toBeInTheDocument();
});

test('handles form submission with non-matching passwords', async () => {
  // Renderiza o componente ChangePasswordForm
  render(<ChangePasswordForm />);

  // Preenche os campos de senha e confirmação de senha com senhas não correspondentes
  const passwordInput = screen.getByLabelText(/password/i);
  const confirmPasswordInput = screen.getByLabelText(/newPassword/i);
  fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Test456!' } });

  // Submete o formulário
  const submitButton = screen.getByText(/changePassword/i);
  fireEvent.click(submitButton);

  // Assert que a mensagem de toast de erro para senhas não correspondentes é exibida
  const errorToast = await screen.findByText(/passwordDonotMatch/i);
  expect(errorToast).toBeInTheDocument();
});
