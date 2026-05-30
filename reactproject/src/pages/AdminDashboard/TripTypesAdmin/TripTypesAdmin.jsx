import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { useTripTypes, useDeleteTripType } from '../../../hooks/useTripTypes';
import TripTypeForm from './TripTypeForm';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'ru', label: 'Russian' },
  { key: 'it', label: 'Italian' },
  { key: 'ro', label: 'Romanian' },
  { key: 'es', label: 'Spanish' },
  { key: 'de', label: 'German' },
  { key: 'bl', label: 'Bulgarian' },
];

export default function TripTypesAdmin() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  const { data: tripTypesResponse, isLoading, isError, error, refetch } = useTripTypes(page, pageSize);
  const tripTypes = Array.isArray(tripTypesResponse?.data)
    ? tripTypesResponse.data
    : Array.isArray(tripTypesResponse) ? tripTypesResponse : [];

  const deleteMutation = useDeleteTripType();

  const handleCreate = () => {
    setSelectedType(null);
    setShowForm(true);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedType(null);
  };

  const handleDeleteClick = (type) => {
    setTypeToDelete(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (typeToDelete) {
      deleteMutation.mutate(typeToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setTypeToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTypeToDelete(null);
  };

  const isPending = deleteMutation.isPending;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0 fw-bold">Trip Types</h2>
          <p className="text-muted mb-0">Manage categories for your travel packages.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleCreate} className="d-flex align-items-center gap-2">
            <HiOutlinePlus /> Add Trip Type
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading trip types...</p>
            </div>
          ) : isError ? (
            <Alert variant="danger">
              <Alert.Heading>Error loading trip types</Alert.Heading>
              <p>{error?.response?.data?.detail || error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>Try Again</Button>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type Name</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tripTypes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        <div className="mb-2" style={{ fontSize: '2rem' }}>📂</div>
                        No trip types found. Click "Add Trip Type" to create one.
                      </td>
                    </tr>
                  ) : (
                    tripTypes.map((type) => (
                      <tr key={type.id}>
                        <td className="text-muted">#{type.id}</td>
                        <td className="fw-semibold">{type.name}</td>
                        <td className="text-end">
                          <Button
                            variant="light"
                            size="sm"
                            className="me-2 text-warning"
                            title="Edit Type"
                            onClick={() => handleEdit(type)}
                          >
                            <HiOutlinePencilAlt />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="text-danger"
                            title="Delete Type"
                            onClick={() => handleDeleteClick(type)}
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

      {/* Trip Type Form Modal */}
      <TripTypeForm
        show={showForm}
        handleClose={handleCloseForm}
        initialData={selectedType}
        languages={LANGUAGES}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete the trip type{' '}
            <strong>"{typeToDelete?.name}"</strong>? This action cannot be undone.
          </p>
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
