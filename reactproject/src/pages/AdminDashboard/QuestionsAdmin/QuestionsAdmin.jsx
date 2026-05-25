import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { useQuestions, useDeleteQuestion } from '../../../hooks/useQuestions';
import QuestionForm from './QuestionForm';

export default function QuestionsAdmin() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showForm, setShowForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const { data: questionsResponse, isLoading, isError, error, refetch } = useQuestions(page, pageSize);
  const questions = Array.isArray(questionsResponse?.data)
    ? questionsResponse.data
    : Array.isArray(questionsResponse) ? questionsResponse : [];

  const deleteMutation = useDeleteQuestion();

  const handleCreate = () => {
    setSelectedQuestion(null);
    setShowForm(true);
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedQuestion(null);
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      deleteMutation.mutate(questionToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setQuestionToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const isPending = deleteMutation.isPending;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0 fw-bold">Questions</h2>
          <p className="text-muted mb-0">Manage frequently asked questions shown to end users.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleCreate} className="d-flex align-items-center gap-2">
            <HiOutlinePlus /> Add Question
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading questions...</p>
            </div>
          ) : isError ? (
            <Alert variant="danger">
              <Alert.Heading>Error loading questions</Alert.Heading>
              <p>{error?.response?.data?.detail || error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>Try Again</Button>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th className="text-end" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        <div className="mb-2" style={{ fontSize: '2rem' }}>❓</div>
                        No questions found. Click "Add Question" to create one.
                      </td>
                    </tr>
                  ) : (
                    questions.map((question) => (
                      <tr key={question.id}>
                        <td className="text-muted">#{question.id}</td>
                        <td className="fw-semibold">
                          <div className="text-truncate" style={{ maxWidth: '300px' }}>
                            {question.text || '—'}
                          </div>
                        </td>
                        <td>
                          <div className="text-truncate text-muted" style={{ maxWidth: '300px' }}>
                            {question.answer || '—'}
                          </div>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="light"
                            size="sm"
                            className="me-2 text-warning"
                            title="Edit Question"
                            onClick={() => handleEdit(question)}
                          >
                            <HiOutlinePencilAlt />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="text-danger"
                            title="Delete Question"
                            onClick={() => handleDeleteClick(question)}
                            disabled={isPending}
                          >
                            <HiOutlineTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Question Form Modal */}
      <QuestionForm
        show={showForm}
        handleClose={handleCloseForm}
        initialData={selectedQuestion}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
          {questionToDelete && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>Q:</strong> {questionToDelete.text || '—'}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
