import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl'; // Import IntlProvider
import FilterBar from '../components/header/FilterBar';

describe('FilterBar', () => {

  it('renders component count correctly', () => {
    render(
      <IntlProvider locale="en">
        <BrowserRouter>
          <FilterBar projectsTotal={0} componentsTotal={3} />
        </BrowserRouter>
      </IntlProvider>
    );

    const componentCount = screen.getByText('3 components');
    expect(componentCount).toBeInTheDocument();
  });

  it('renders component count correctly', () => {
    render(
      <IntlProvider locale="en">
        <BrowserRouter>
          <FilterBar projectsTotal={0} componentsTotal={3} />
        </BrowserRouter>
      </IntlProvider>
    );
    const componentCount = screen.getByText('3 components');
    expect(componentCount).toBeInTheDocument();
  });

  it('renders home icon when on home page', () => {
    render(
      <IntlProvider locale="en">
        <BrowserRouter>
          <FilterBar projectsTotal={0} componentsTotal={0} />
        </BrowserRouter>
      </IntlProvider>
    );
    const homeIcon = screen.getByTestId('home-icon');
    expect(homeIcon).toBeInTheDocument();
  });

  it('renders slider icon when on mobile', () => {
    render(
      <IntlProvider locale="en">
        <BrowserRouter>
          <FilterBar projectsTotal={0} componentsTotal={0} />
        </BrowserRouter>
      </IntlProvider>
    );
    const sliderIcon = screen.getByTestId('slider-icon');
    expect(sliderIcon).toBeInTheDocument();
  });

  
});