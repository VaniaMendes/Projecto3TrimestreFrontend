import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmAccountForm from '../components/forms/ConfirmAccountForm.js';
import queryString from "query-string";

test('it should change the lab when a new option is selected', () => {
  const { getByTestId } = render(<ConfirmAccountForm />);
  
  const select = getByTestId('lab-select');
  const selectedLab = getByTestId('selected-lab');

  // Verify initial state
  expect(select.value).toBe('');
  expect(selectedLab).toHaveTextContent('Selected Lab: ');

  // Change to Lab 1
  fireEvent.change(select, { target: { value: 'lab1' } });
  expect(select.value).toBe('lab1');
  expect(selectedLab).toHaveTextContent('Selected Lab: lab1');

  // Change to Lab 2
  fireEvent.change(select, { target: { value: 'lab2' } });
  expect(select.value).toBe('lab2');
  expect(selectedLab).toHaveTextContent('Selected Lab: lab2');
});
