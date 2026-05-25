import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateTrip } from '../../hooks/useTrips';
import TripForm from '../../components/trips/TripForm';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const handleCreateSubmit = (payload) => {
    createTrip.mutate(payload, {
      onSuccess: () => {
        navigate('/dashboard/trips');
      },
    });
  };

  return (
    <Container fluid className="py-4 text-white">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0 fw-bold">Create New Voyage</h2>
          <p className="text-muted mb-0 small">Construct a beautiful new travel package for your catalog.</p>
        </Col>
      </Row>

      <Row>
        <Col lg={9}>
          <TripForm
            onSubmit={handleCreateSubmit}
            isPending={createTrip.isPending}
          />
        </Col>
      </Row>
    </Container>
  );
}
