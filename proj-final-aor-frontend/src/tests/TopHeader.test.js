import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import * as UserStoreModule from '../stores/UserStore'; 
import TopHeader from '../components/header/TopHeader';


// Mock the userStore and FormattedMessage
jest.mock('../stores/UserStore', () => ({
  userStore: jest.fn(),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: jest.fn(({ id }) => <span>{id}</span>),
}));

describe('TopHeader', () => {
  const mockLocale = 'en';
  const mockUpdateLocale = jest.fn();

  beforeEach(() => {
    // Setup mock for userStore before each test
    UserStoreModule.userStore.mockImplementation(() => ({
      locale: mockLocale,
      updateLocale: mockUpdateLocale,
    }));
  });

  it('initializes with the locale from userStore', () => {
    const { getByText } = render(<TopHeader />);
    expect(getByText('EN')).toHaveClass('selected-language');
  });

  it('updates locale on language selection', () => {
    const { getByText } = render(<TopHeader />);
    fireEvent.click(getByText('PT'));
    expect(mockUpdateLocale).toHaveBeenCalledWith('pt');
    expect(getByText('PT')).toHaveClass('selected-language');
  });

});