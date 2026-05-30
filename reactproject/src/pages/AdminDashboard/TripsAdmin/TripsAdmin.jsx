import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';
import { useTrips, useDeactivateTrip, useReactivateTrip } from '../../../hooks/useTrips';

export default function TripsAdmin() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const [showForm, setShowForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { data, isLoading, isError, error, refetch } = useTrips({
    page,
    pageSize,
    search: search || undefined,
  });

  const deactivateTrip = useDeactivateTrip();
  const reactivateTrip = useReactivateTrip();

  const handleEdit = (trip) => {
    navigate(`/dashboard/trips/edit/${trip.id}`);
  };

  const handleCreateNew = () => {
    navigate('/dashboard/trips/create');
  };

  const handleDelete = (trip) => {
    if (window.confirm('Are you sure you want to deactivate this trip?')) {
      deactivateTrip.mutate(trip.id);
    }
  };

  const handleReactivate = (trip) => {
    if (window.confirm('Are you sure you want to reactivate this trip?')) {
      reactivateTrip.mutate(trip.id);
    }
  };

  // Safely extract trips list & totalPages supporting both paginated and flat-array layouts
  const rawData = data?.data ?? [];
  const trips = Array.isArray(rawData) ? rawData : (rawData?.items || []);
  const totalPages = Array.isArray(rawData) ? 1 : (rawData?.totalPages || 1);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0 fw-bold">Trips Management</h2>
          <p className="text-muted mb-0">Manage your travel packages and destinations.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleCreateNew} className="d-flex align-items-center gap-2">
            <HiOutlinePlus /> Add Trip
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Control
                type="search"
                placeholder="Search trips..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset page on search
                }}
              />
            </Col>
          </Row>

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : isError ? (
            <Alert variant="danger">
              <Alert.Heading>Error loading trips</Alert.Heading>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>Try Again</Button>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Trip Details</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No trips found.
                      </td>
                    </tr>
                  ) : (
                    trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {trip.image ? (
                              <img 
                                src={trip.image} 
                                alt={trip.title} 
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              <div 
                                className="bg-light d-flex align-items-center justify-content-center text-muted"
                                style={{ width: '48px', height: '48px', borderRadius: '8px', fontSize: '12px' }}
                              >
                                No Img
                              </div>
                            )}
                            <div>
                              <h6 className="mb-0 fw-semibold">{trip.title}</h6>
                              <small className="text-muted">{trip.destination}</small>
                            </div>
                          </div>
                        </td>
                        <td>{trip.duration || 'Flexible'}</td>
                        <td>${trip.price?.toLocaleString() || 'Flexible'}</td>
                        <td>
                          {trip.isInactive ? (
                            <Badge bg="secondary" pill>Inactive</Badge>
                          ) : (
                            <Badge bg="success" pill>Active</Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="me-2 text-warning" 
                            title="Edit Trip"
                            onClick={() => handleEdit(trip)}
                          >
                            <HiOutlinePencilAlt />
                          </Button>
                          {trip.isInactive ? (
                            <Button 
                              variant="light" 
                              size="sm" 
                              className="text-success" 
                              title="Reactivate"
                              onClick={() => handleReactivate(trip)}
                            >
                              <HiOutlineRefresh />
                            </Button>
                          ) : (
                            <Button 
                              variant="light" 
                              size="sm" 
                              className="text-danger" 
                              title="Deactivate"
                              onClick={() => handleDelete(trip)}
                            >
                              <HiOutlineTrash />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted small">
                Showing page {page} of {totalPages}
              </span>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
