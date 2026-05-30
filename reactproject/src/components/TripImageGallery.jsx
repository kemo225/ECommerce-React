import { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';

export default function TripImageGallery({ images = [], show, onClose }) {
  const [index, setIndex] = useState(0);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton />
      <Modal.Body className="p-0 bg-dark">
        <Carousel activeIndex={index} onSelect={(i) => setIndex(i)} indicators={images.length>1}>
          {images.map((img, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={img.url || img.imagePath}
                alt={`slide-${i}`}
                style={{ maxHeight: '60vh', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
}
