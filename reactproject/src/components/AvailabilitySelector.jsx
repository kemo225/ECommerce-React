import React from 'react';
import { Form } from 'react-bootstrap';

const DAYS = [
  { v: 0, label: 'Sun' },
  { v: 1, label: 'Mon' },
  { v: 2, label: 'Tue' },
  { v: 3, label: 'Wed' },
  { v: 4, label: 'Thu' },
  { v: 5, label: 'Fri' },
  { v: 6, label: 'Sat' },
];

export default function AvailabilitySelector({ value = [], onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (day) => {
    const next = selected.includes(day) ? selected.filter(d => d !== day) : [...selected, day];
    onChange?.(next);
  };

  return (
    <div className="d-flex gap-2 flex-wrap">
      {DAYS.map(d => (
        <Form.Check
          key={d.v}
          type="checkbox"
          id={`day-${d.v}`}
          label={d.label}
          checked={selected.includes(d.v)}
          onChange={() => toggle(d.v)}
        />
      ))}
    </div>
  );
}
