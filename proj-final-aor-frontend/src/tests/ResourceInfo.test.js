import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ResourceInfo from '../components/resources/ResourceInfo';
import { IntlProvider } from 'react-intl';

describe('ResourceInfo', () => {
  const mockProps = {
    photo: 'resource-photo.jpg',
    id: 1,
    name: 'Resource Name',
    brand: 'Resource Brand',
    type: 'DIGITAL',
    projectsNumber: 5,
    onClick: jest.fn(),
  };

  const messages = {
    brand: 'Brand',
    projectsNumber: 'Projects Number',
  };

  const locale = 'en';

  const renderWithIntl = (component) => {
    return render(
      <IntlProvider locale={locale} messages={messages}>
        {component}
      </IntlProvider>
    );
  };

  it('renders resource info correctly', () => {
    const { getByText, getByAltText } = renderWithIntl(<ResourceInfo {...mockProps} />);

    expect(getByAltText('Resource')).toBeInTheDocument();
    expect(getByText('Resource Name')).toBeInTheDocument();
    expect(getByText('Resource Brand')).toBeInTheDocument();
    expect(getByText((content, element) => content.includes('Projects Number'))).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const { getByTestId } = renderWithIntl(<ResourceInfo {...mockProps} />);
    const resourceContainer = getByTestId('resource-container');

    fireEvent.click(resourceContainer);

    expect(mockProps.onClick).toHaveBeenCalled();
  });

});