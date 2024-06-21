import React from 'react';
import './Notifications.css'; 
import { useIntl } from 'react-intl';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const intl = useIntl();

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {intl.formatMessage({ id: 'previous' })}
      </button>
      <span className="page-number">{currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {intl.formatMessage({ id: 'next' })}
      </button>
    </div>
  );
};

export default Pagination;