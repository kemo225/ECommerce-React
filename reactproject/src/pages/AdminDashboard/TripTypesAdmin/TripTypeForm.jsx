import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useCreateTripType, useUpdateTripType } from '../../../hooks/useTripTypes';

const LANGUAGES = [
  { key: 'en', label: 'English', flag: '🇬🇧' },
  { key: 'fr', label: 'French', flag: '🇫🇷' },
  { key: 'ru', label: 'Russian', flag: '🇷🇺' },
  { key: 'it', label: 'Italian', flag: '🇮🇹' },
  { key: 'ro', label: 'Romanian', flag: '🇷🇴' },
  { key: 'es', label: 'Spanish', flag: '🇪🇸' },
  { key: 'de', label: 'German', flag: '🇩🇪' },
  { key: 'bl', label: 'Bulgarian', flag: '🇧🇬' },
];

const getEmptyNames = () => {
  const names = {};
  LANGUAGES.forEach((lang) => {
    names[lang.key] = '';
  });
  return names;
};

export default function TripTypeForm({ show, handleClose, initialData }) {
  const isEdit = !!initialData;
  const [names, setNames] = useState(getEmptyNames());
  const [errors, setErrors] = useState({});

  const createMutation = useCreateTripType();
  const updateMutation = useUpdateTripType();

  useEffect(() => {
    if (show) {
      if (initialData) {
        // If initialData.name is a string, put it in 'en'; if object, spread it
        if (typeof initialData.name === 'object' && initialData.name !== null) {
          setNames({ ...getEmptyNames(), ...initialData.name });
        } else {
          setNames({ ...getEmptyNames(), en: initialData.name || '' });
        }
      } else {
        setNames(getEmptyNames());
      }
      setErrors({});
    }
  }, [show, initialData]);

  const handleChange = (key, value) => {
    setNames((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!names.en?.trim()) {
      newErrors.en = 'English name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload – trim all values, only include non-empty
    const namePayload = {};
    LANGUAGES.forEach((lang) => {
      const val = names[lang.key]?.trim();
      if (val) namePayload[lang.key] = val;
    });

    if (isEdit) {
      updateMutation.mutate(
        { id: initialData.id, name: namePayload },
        { onSuccess: () => handleClose() }
      );
    } else {
      createMutation.mutate(
        { name: namePayload },
        { onSuccess: () => handleClose() }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold">
          {isEdit ? 'Edit Trip Type' : 'Create Trip Type'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted mb-4">
            Enter the trip type name in each supported language. English is required.
          </p>
          <Row>
            {LANGUAGES.map((lang) => (
              <Col md={6} key={lang.key}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">
                    {lang.flag} {lang.label} Name
                    {lang.key === 'en' && <span className="text-danger ms-1">*</span>}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${lang.label.toLowerCase()} name...`}
                    value={names[lang.key] || ''}
                    onChange={(e) => handleChange(lang.key, e.target.value)}
                    isInvalid={!!errors[lang.key]}
                    disabled={isPending}
                  />
                  {errors[lang.key] && (
                    <Form.Control.Feedback type="invalid">
                      {errors[lang.key]}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
