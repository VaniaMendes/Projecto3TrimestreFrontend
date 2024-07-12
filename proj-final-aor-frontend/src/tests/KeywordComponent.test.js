import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import KeywordComponent from '../components/keywords/KeywordComponent';


describe('KeywordComponent', () => {
  const mockKeyword = 'React';
  const mockId = 1;
  const mockOnClick = jest.fn();
  const mockOnRemoveClick = jest.fn();
  const mockOnRemoveSkill = jest.fn();
  const mockOnRemoveInterest = jest.fn();

  it('renders keyword correctly', () => {
    const { getByText } = render(
      <KeywordComponent keyword={mockKeyword} />
    );
    expect(getByText(mockKeyword)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const { getByText } = render(
      <KeywordComponent keyword={mockKeyword} onClick={mockOnClick} />
    );
    fireEvent.click(getByText(mockKeyword));
    expect(mockOnClick).toHaveBeenCalledWith(mockKeyword);
  });

});