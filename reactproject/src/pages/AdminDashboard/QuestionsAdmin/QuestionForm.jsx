import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useCreateQuestion, useUpdateQuestion } from '../../../hooks/useQuestions';

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

const getEmptyFields = () => {
  const fields = {};
  LANGUAGES.forEach((lang) => {
    fields[lang.key] = '';
  });
  return fields;
};

export default function QuestionForm({ show, handleClose, initialData }) {
  const isEdit = !!initialData;
  const [texts, setTexts] = useState(getEmptyFields());
  const [answers, setAnswers] = useState(getEmptyFields());
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('question');

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  useEffect(() => {
    if (show) {
      if (initialData) {
        // Handle both string and object formats
        if (typeof initialData.text === 'object' && initialData.text !== null) {
          setTexts({ ...getEmptyFields(), ...initialData.text });
        } else {
          setTexts({ ...getEmptyFields(), en: initialData.text || '' });
        }
        if (typeof initialData.answer === 'object' && initialData.answer !== null) {
          setAnswers({ ...getEmptyFields(), ...initialData.answer });
        } else {
          setAnswers({ ...getEmptyFields(), en: initialData.answer || '' });
        }
      } else {
        setTexts(getEmptyFields());
        setAnswers(getEmptyFields());
      }
      setErrors({});
      setActiveTab('question');
    }
  }, [show, initialData]);

  const handleTextChange = (key, value) => {
    setTexts((prev) => ({ ...prev, [key]: value }));
    if (errors[`text_${key}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`text_${key}`];
        return next;
      });
    }
  };

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[`answer_${key}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`answer_${key}`];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!texts.en?.trim()) {
      newErrors.text_en = 'English question text is required';
    }
    if (!answers.en?.trim()) {
      newErrors.answer_en = 'English answer is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload – trim all values, only include non-empty
    const textPayload = {};
    const answerPayload = {};
    LANGUAGES.forEach((lang) => {
      const textVal = texts[lang.key]?.trim();
      const answerVal = answers[lang.key]?.trim();
      if (textVal) textPayload[lang.key] = textVal;
      if (answerVal) answerPayload[lang.key] = answerVal;
    });

    if (isEdit) {
      updateMutation.mutate(
        { id: initialData.id, text: textPayload, answer: answerPayload },
        { onSuccess: () => handleClose() }
      );
    } else {
      createMutation.mutate(
        { text: textPayload, answer: answerPayload },
        { onSuccess: () => handleClose() }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold">
          {isEdit ? 'Edit Question' : 'Create Question'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            fill
          >
            <Tab eventKey="question" title="📝 Question Text">
              <p className="text-muted mb-3">
                Enter the question in each supported language. English is required.
              </p>
              <Row>
                {LANGUAGES.map((lang) => (
                  <Col md={6} key={lang.key}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        {lang.flag} {lang.label}
                        {lang.key === 'en' && <span className="text-danger ms-1">*</span>}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder={`Question in ${lang.label.toLowerCase()}...`}
                        value={texts[lang.key] || ''}
                        onChange={(e) => handleTextChange(lang.key, e.target.value)}
                        isInvalid={!!errors[`text_${lang.key}`]}
                        disabled={isPending}
                      />
                      {errors[`text_${lang.key}`] && (
                        <Form.Control.Feedback type="invalid">
                          {errors[`text_${lang.key}`]}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab eventKey="answer" title="💬 Answer Text">
              <p className="text-muted mb-3">
                Enter the answer in each supported language. English is required.
              </p>
              <Row>
                {LANGUAGES.map((lang) => (
                  <Col md={6} key={lang.key}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        {lang.flag} {lang.label}
                        {lang.key === 'en' && <span className="text-danger ms-1">*</span>}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={`Answer in ${lang.label.toLowerCase()}...`}
                        value={answers[lang.key] || ''}
                        onChange={(e) => handleAnswerChange(lang.key, e.target.value)}
                        isInvalid={!!errors[`answer_${lang.key}`]}
                        disabled={isPending}
                      />
                      {errors[`answer_${lang.key}`] && (
                        <Form.Control.Feedback type="invalid">
                          {errors[`answer_${lang.key}`]}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
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
