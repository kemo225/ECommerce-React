import React from 'react';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip, useUpdateTrip } from '../../hooks/useTrips';
import TripForm from '../../components/trips/TripForm';
import TripImagesManager from '../../components/trips/TripImagesManager';

export default function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useTrip(id);
  const updateTrip = useUpdateTrip();

  const trip = data?.data ?? data;

  const handleUpdateSubmit = (payload) => {
    updateTrip.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          navigate('/dashboard/trips');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 text-white">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0 fw-bold">Edit Voyage Collection</h2>
          <p className="text-muted mb-0 small">Modify specifications and manage localized photo galleries.</p>
        </Col>
      </Row>

      <Row>
        <Col lg={9}>
          {/* General Details & Translation Form */}
          <TripForm
            initialData={trip}
            onSubmit={handleUpdateSubmit}
            isPending={updateTrip.isPending}
          />

          {/* Galleries & Upload Manager */}
          {trip && (
            <TripImagesManager
              tripId={trip.id}
              images={trip.images || []}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
