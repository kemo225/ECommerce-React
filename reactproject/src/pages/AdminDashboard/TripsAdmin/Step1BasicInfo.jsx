import { Form, Row, Col } from 'react-bootstrap';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'ru', 'it', 'ro', 'es', 'de', 'bl'];

export default function Step1BasicInfo({ register, errors }) {
  return (
    <div>
      <h5 className="fw-bold mb-4">Trip Basic Information</h5>
      <p className="text-muted mb-4">Provide trip name, destination, and description in multiple languages</p>

      {/* Name Translations */}
      <div className="mb-4">
        <h6 className="mb-3 fw-semibold">Trip Name</h6>
        {SUPPORTED_LANGUAGES.map(lang => (
          <Form.Group className="mb-2" key={`name-${lang}`}>
            <Form.Label className="small">{lang.toUpperCase()}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Trip name in ${lang}`}
              isInvalid={!!errors.name?.[lang]}
              {...register(`name.${lang}`)}
              className="bg-light"
            />
            {errors.name?.[lang] && (
              <Form.Text className="text-danger">{errors.name[lang].message}</Form.Text>
            )}
          </Form.Group>
        ))}
      </div>

      {/* Destination Translations */}
      <div className="mb-4">
        <h6 className="mb-3 fw-semibold">Destination</h6>
        {SUPPORTED_LANGUAGES.map(lang => (
          <Form.Group className="mb-2" key={`dest-${lang}`}>
            <Form.Label className="small">{lang.toUpperCase()}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Destination in ${lang}`}
              isInvalid={!!errors.destination?.[lang]}
              {...register(`destination.${lang}`)}
              className="bg-light"
            />
            {errors.destination?.[lang] && (
              <Form.Text className="text-danger">{errors.destination[lang].message}</Form.Text>
            )}
          </Form.Group>
        ))}
      </div>

      {/* Description Translations */}
      <div className="mb-4">
        <h6 className="mb-3 fw-semibold">Description</h6>
        {SUPPORTED_LANGUAGES.map(lang => (
          <Form.Group className="mb-2" key={`desc-${lang}`}>
            <Form.Label className="small">{lang.toUpperCase()}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={`Description in ${lang}`}
              isInvalid={!!errors.description?.[lang]}
              {...register(`description.${lang}`)}
              className="bg-light"
            />
            {errors.description?.[lang] && (
              <Form.Text className="text-danger">{errors.description[lang].message}</Form.Text>
            )}
          </Form.Group>
        ))}
      </div>
    </div>
  );
}
