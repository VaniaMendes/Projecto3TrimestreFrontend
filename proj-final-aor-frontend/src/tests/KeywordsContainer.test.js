import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import KeywordsContainer from '../components/keywords/KeywordsContainer';
import SkillInterestService from '../services/SkillInterestService';
import ProjectService from '../services/ProjectService';

jest.mock('../services/SkillInterestService');
jest.mock('../services/ProjectService');

describe('KeywordsContainer', () => {
  beforeEach(() => {
    SkillInterestService.getAllSkillsWithProjects.mockResolvedValue([
      { id: 1, name: 'React' },
      { id: 2, name: 'JavaScript' },
    ]);
    ProjectService.getKeywords.mockResolvedValue([
      { id: 3, name: 'HTML' },
      { id: 4, name: 'CSS' },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders keywords correctly', async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <KeywordsContainer />
        </MemoryRouter>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(getByText('React')).toBeInTheDocument();
      expect(getByText('JavaScript')).toBeInTheDocument();
      expect(getByText('HTML')).toBeInTheDocument();
      expect(getByText('CSS')).toBeInTheDocument();
    });
  });
});