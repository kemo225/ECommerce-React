import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, InputGroup } from 'react-bootstrap';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useTrips, useDeactivateTrip, useReactivateTrip } from '../../hooks/useTrips';
import TripTable from '../../components/trips/TripTable';
import Pagination from '../../components/pagination/Pagination';

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useTrips(page, pageSize, {
    SearchItem: search || undefined,
    includeInactive: true,
  });

  const deactivateTrip = useDeactivateTrip();
  const reactivateTrip = useReactivateTrip();

  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this voyage?')) {
      deactivateTrip.mutate(id);
    }
  };

  const handleReactivate = (id) => {
    if (window.confirm('Are you sure you want to reactivate this voyage?')) {
      reactivateTrip.mutate(id);
    }
  };

  const rawData = data?.data ?? [];
  const trips = Array.isArray(rawData) ? rawData : (rawData?.items || []);
  const totalPages = Array.isArray(rawData) ? 1 : (rawData?.totalPages || 1);

  return (
    <Container fluid className="py-4 text-white">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0 fw-bold">Voyages Management</h2>
          <p className="text-muted mb-0 small">Create, update, and manage your travel collections.</p>
        </Col>
        <Col xs="auto">
          <Button 
            as={Link} 
            to="/dashboard/trips/create" 
            variant="primary" 
            className="d-flex align-items-center gap-2"
          >
            <HiOutlinePlus /> Add Voyage
          </Button>
        </Col>
      </Row>

      <Card className="bg-dark border-secondary border-opacity-25 text-white shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col md={5}>
              <InputGroup className="border-secondary border-opacity-50">
                <InputGroup.Text className="bg-dark text-white-50 border-secondary border-opacity-50">
                  <HiOutlineSearch />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search voyages by name, destination..."
                  value={search}
                  className="bg-dark text-white border-secondary border-opacity-50"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          <TripTable
            trips={trips}
            isLoading={isLoading}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
            deactivatePending={deactivateTrip.isPending}
            reactivatePending={reactivateTrip.isPending}
          />

          {!isLoading && !isError && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
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
