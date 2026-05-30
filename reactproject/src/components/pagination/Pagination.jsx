import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) {
  const { t } = useLanguage();

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 my-5 py-3 border-top border-secondary border-opacity-25 text-white">
      {/* Page Size Selector */}
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small">{t('pageSize')}:</span>
        <select
          className="form-select form-select-sm bg-dark text-white border-secondary border-opacity-50"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ width: '80px', borderRadius: '8px' }}
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>

      {/* Pages Controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm mb-0 gap-1 align-items-center">
          <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
            <button
              className="page-link bg-dark text-white border-secondary border-opacity-25 px-3 py-2"
              onClick={() => onPageChange(currentPage - 1)}
              style={{ borderRadius: '8px' }}
            >
              {t('previous')}
            </button>
          </li>
          
          <li className="page-item disabled mx-2">
            <span className="text-muted small">
              {currentPage} / {totalPages || 1}
            </span>
          </li>

          <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link bg-dark text-white border-secondary border-opacity-25 px-3 py-2"
              onClick={() => onPageChange(currentPage + 1)}
              style={{ borderRadius: '8px' }}
            >
              {t('next')}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
