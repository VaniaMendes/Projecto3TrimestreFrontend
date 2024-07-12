import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import Header from '../components/header/Header';

describe('Header', () => {

  it('renders the header correctly', () => {
  const { getByAltText, getByPlaceholderText } = render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </IntlProvider>
  );

  // Check if the logo is rendered
  const logo = getByAltText('CSW Logo');
  expect(logo).toBeInTheDocument();

  // Check if the search bar is rendered with the correct placeholder text
  const searchInput = getByPlaceholderText('searchProjects'); // Adjusted placeholder text
  expect(searchInput).toBeInTheDocument();
});


  it('renders the logo correctly', () => {
    const { getByAltText } = render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </IntlProvider>
    );

    const logo = getByAltText('CSW Logo');
    expect(logo).toBeInTheDocument();
  });

});