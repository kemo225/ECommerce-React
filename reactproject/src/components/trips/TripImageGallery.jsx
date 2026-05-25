import React from 'react';
import { Modal, Row, Col, Card } from 'react-bootstrap';
import { HiOutlineCheck } from 'react-icons/hi';

export default function TripImageGallery({ show, onHide, images = [], tripName }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="trip-gallery-modal">
      <Modal.Header closeButton className="bg-dark text-white border-secondary border-opacity-25">
        <Modal.Title className="fs-5">{tripName || 'Voyage'} Gallery</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white p-4">
        {images.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No images uploaded for this voyage yet.
          </div>
        ) : (
          <Row className="g-3">
            {images.map((img) => (
              <Col xs={6} md={4} key={img.id}>
                <Card className="bg-dark border-secondary h-100 overflow-hidden">
                  <div className="position-relative" style={{ height: '140px' }}>
                    <Card.Img
                      variant="top"
                      src={img.imageUrl}
                      className="w-100 h-100 object-fit-cover"
                    />
                    {img.isPrimary && (
                      <span 
                        className="badge bg-success position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1"
                        style={{ fontSize: '0.65rem' }}
                      >
                        <HiOutlineCheck /> Primary
                      </span>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
}
