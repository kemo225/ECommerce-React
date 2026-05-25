import React, { useState } from 'react';
import { Form, Nav } from 'react-bootstrap';
import { LANGUAGES } from './MultilingualInput';

export default function MultilingualTextarea({ 
  name, 
  register, 
  errors, 
  label, 
  placeholder,
  rows = 3,
  syncLang,
  onSyncLangChange 
}) {
  const [localLang, setLocalLang] = useState('en');
  const activeLang = syncLang || localLang;
  const setActiveLang = onSyncLangChange || setLocalLang;

  return (
    <Form.Group className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Form.Label className="fw-semibold mb-0 small text-white-50">{label}</Form.Label>
        
        <Nav variant="pills" activeKey={activeLang} onSelect={setActiveLang} className="small">
          {LANGUAGES.map((lang) => {
            const hasError = !!errors?.[name]?.[lang.code];
            return (
              <Nav.Item key={lang.code}>
                <Nav.Link 
                  eventKey={lang.code}
                  className={`py-0 px-2 small rounded-pill text-uppercase ${hasError ? 'text-danger fw-bold border border-danger' : 'text-white-50'}`}
                  style={{ fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  {lang.code}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </div>

      {LANGUAGES.map((lang) => (
        <div key={lang.code} className={activeLang === lang.code ? 'd-block' : 'd-none'}>
          <Form.Control
            as="textarea"
            rows={rows}
            placeholder={`${placeholder || label} (${lang.name})...`}
            className="bg-dark text-white border-secondary border-opacity-50"
            isInvalid={!!errors?.[name]?.[lang.code]}
            {...register(`${name}.${lang.code}`)}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.[name]?.[lang.code]?.message}
          </Form.Control.Feedback>
        </div>
      ))}
    </Form.Group>
  );
}
