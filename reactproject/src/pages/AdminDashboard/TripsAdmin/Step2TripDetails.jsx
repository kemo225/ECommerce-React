import { Form, Row, Col } from 'react-bootstrap';

export default function Step2TripDetails({ register, errors, tripTypes }) {
  const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
  ];

  return (
    <div>
      <h5 className="fw-bold mb-4">Trip Details</h5>
      <p className="text-muted mb-4">Configure pricing, duration, and availability</p>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.timeFrom}
              {...register('timeFrom')}
              className="bg-light"
            />
            {errors.timeFrom && (
              <Form.Text className="text-danger">{errors.timeFrom.message}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              min="1"
              isInvalid={!!errors.durationValue}
              {...register('durationValue')}
              className="bg-light"
            />
            {errors.durationValue && (
              <Form.Text className="text-danger">{errors.durationValue.message}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              isInvalid={!!errors.durationType}
              {...register('durationType')}
              className="bg-light"
            >
              <option value="days">Days</option>
              <option value="hours">Hours</option>
            </Form.Select>
            {errors.durationType && (
              <Form.Text className="text-danger">{errors.durationType.message}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Adult Price ($)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              isInvalid={!!errors.adultPrice}
              {...register('adultPrice')}
              className="bg-light"
            />
            {errors.adultPrice && (
              <Form.Text className="text-danger">{errors.adultPrice.message}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Child Price ($)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              isInvalid={!!errors.childPrice}
              {...register('childPrice')}
              className="bg-light"
            />
            {errors.childPrice && (
              <Form.Text className="text-danger">{errors.childPrice.message}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Trip Type</Form.Label>
        <Form.Select
          isInvalid={!!errors.tripTypeId}
          {...register('tripTypeId')}
          className="bg-light"
        >
          <option value="">Select a trip type...</option>
          {tripTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Form.Select>
        {errors.tripTypeId && (
          <Form.Text className="text-danger">{errors.tripTypeId.message}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Available Days</Form.Label>
        <div className="bg-light p-3 rounded">
          {DAYS_OF_WEEK.map(day => (
            <Form.Check
              key={day.value}
              type="checkbox"
              label={day.label}
              value={day.value}
              {...register('availabilityDays')}
              className="mb-2"
            />
          ))}
        </div>
        {errors.availabilityDays && (
          <Form.Text className="text-danger">{errors.availabilityDays.message}</Form.Text>
        )}
      </Form.Group>
    </div>
  );
}
