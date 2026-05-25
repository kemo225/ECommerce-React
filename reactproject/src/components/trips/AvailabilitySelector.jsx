import React from 'react';
import { Form } from 'react-bootstrap';

export const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export default function AvailabilitySelector({ register, errors, name }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold mb-2 small text-white-50">Availability Days</Form.Label>
      <div className="d-flex flex-wrap gap-3 p-3 bg-dark bg-opacity-25 rounded border border-secondary border-opacity-25">
        {DAYS_OF_WEEK.map((day) => (
          <Form.Check
            key={day.value}
            type="checkbox"
            id={`day-select-${day.value}`}
            label={day.label}
            value={day.value}
            className="text-white-50 fw-semibold"
            isInvalid={!!errors?.[name]}
            {...register(name)}
          />
        ))}
      </div>
      {errors?.[name] && (
        <div className="text-danger small mt-1">{errors[name].message}</div>
      )}
    </Form.Group>
  );
}
