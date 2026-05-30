import { useState } from 'react';
import { Nav, Form } from 'react-bootstrap';

const LANGS = ['en','fr','ru','it','ro','es','de','bl'];

export default function MultilingualTextarea({ value = {}, onChange, placeholder='' }) {
  const [active, setActive] = useState('en');
  const current = value || {};

  const handleChange = (lang, v) => {
    const next = { ...current, [lang]: v };
    onChange?.(next);
  };

  return (
    <div>
      <Nav variant="tabs" className="mb-2">
        {LANGS.map(l => (
          <Nav.Item key={l}>
            <Nav.Link active={active===l} onClick={() => setActive(l)}>{l.toUpperCase()}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Form.Control
        as="textarea"
        rows={4}
        placeholder={placeholder}
        value={current[active] || ''}
        onChange={(e) => handleChange(active, e.target.value)}
      />
    </div>
  );
}
