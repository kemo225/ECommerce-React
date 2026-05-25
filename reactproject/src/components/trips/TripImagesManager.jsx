import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { HiOutlineTrash, HiOutlineCheck, HiOutlineUpload } from 'react-icons/hi';
import { 
  useUploadTripImages, 
  useDeleteTripImage, 
  useSetPrimaryTripImage 
} from '../../hooks/useTrips';

export default function TripImagesManager({ tripId, images = [] }) {
  const uploadImages = useUploadTripImages();
  const deleteImage = useDeleteTripImage();
  const setPrimaryImage = useSetPrimaryTripImage();

  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    uploadImages.mutate(
      { id: tripId, files: selectedFiles },
      {
        onSuccess: () => {
          setSelectedFiles(null);
          const fileInput = document.getElementById('tripImagesUploadInput');
          if (fileInput) fileInput.value = '';
        },
      }
    );
  };

  const handleSetPrimary = (imageId) => {
    setPrimaryImage.mutate({ id: tripId, imageId });
  };

  const handleDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage.mutate({ id: tripId, imageId });
    }
  };

  const isPending = uploadImages.isPending || deleteImage.isPending || setPrimaryImage.isPending;

  return (
    <Card className="bg-dark border-secondary border-opacity-25 text-white shadow-sm mt-4">
      <Card.Header className="bg-transparent border-secondary border-opacity-25 py-3">
        <h5 className="mb-0 fw-bold fs-6">Voyage Photo Gallery</h5>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Upload Form */}
        <Form onSubmit={handleUploadSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="small text-white-50">Upload Voyage Images (Multiple allowed)</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                id="tripImagesUploadInput"
                type="file"
                multiple
                accept="image/*"
                className="bg-dark text-white border-secondary border-opacity-50"
                onChange={(e) => setSelectedFiles(e.target.files)}
                disabled={isPending}
              />
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!selectedFiles || selectedFiles.length === 0 || isPending}
                className="d-flex align-items-center gap-1"
              >
                {uploadImages.isPending ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineUpload />
                    <span>Upload</span>
                  </>
                )}
              </Button>
            </div>
          </Form.Group>
        </Form>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded text-muted small">
            No images uploaded yet. Select images above to upload.
          </div>
        ) : (
          <Row className="g-3">
            {images.map((img) => (
              <Col xs={6} md={3} key={img.id}>
                <Card className="bg-dark border-secondary h-100 overflow-hidden shadow-sm">
                  <div className="position-relative" style={{ height: '130px' }}>
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
                  <Card.Body className="p-2 d-flex justify-content-between align-items-center bg-dark bg-opacity-50">
                    {!img.isPrimary ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-warning p-0 text-decoration-none small fs-7 fw-semibold"
                        onClick={() => handleSetPrimary(img.id)}
                        disabled={isPending}
                      >
                        Set Primary
                      </Button>
                    ) : (
                      <span className="text-success small fs-7 fw-bold d-flex align-items-center gap-1">
                        <HiOutlineCheck /> Active
                      </span>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0 d-flex align-items-center"
                      onClick={() => handleDelete(img.id)}
                      disabled={isPending}
                      title="Delete Image"
                    >
                      <HiOutlineTrash />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
