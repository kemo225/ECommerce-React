import { Button, Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { HiOutlineCloudUpload, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';
import { useState, useRef } from 'react';
import { useUploadTripImages, useDeleteTripImage, useSetPrimaryImage } from '../../../hooks/useTrips';
import toast from 'react-hot-toast';

export default function ImageManagement({ tripId, images = [], onImageUpdate }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const uploadImages = useUploadTripImages();
  const deleteImage = useDeleteTripImage();
  const setPrimaryImage = useSetPrimaryImage();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (fileArray.length === 0) {
      toast.error('Please upload valid image files');
      return;
    }

    fileArray.forEach(file => {
      const formData = new FormData();
      formData.append('image', file);

      uploadImages.mutate(
        { id: tripId, formData },
        {
          onSuccess: () => {
            toast.success(`Image uploaded: ${file.name}`);
            onImageUpdate?.();
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to upload image');
          },
        }
      );
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage.mutate(
        { id: tripId, imageId },
        {
          onSuccess: () => {
            toast.success('Image deleted');
            onImageUpdate?.();
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to delete image');
          },
        }
      );
    }
  };

  const handleSetPrimary = (imageId) => {
    setPrimaryImage.mutate(
      { id: tripId, imageId },
      {
        onSuccess: () => {
          toast.success('Primary image updated');
          onImageUpdate?.();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Failed to set primary');
        },
      }
    );
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="fw-bold mb-4">Image Management</h5>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-3 p-5 text-center cursor-pointer mb-4 ${
            dragActive ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light border-secondary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <HiOutlineCloudUpload size={48} className="mb-3 text-muted" />
          <h6 className="fw-semibold mb-2">Drag & drop your images here</h6>
          <p className="text-muted small mb-0">or click to browse</p>
          <Form.Control
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Images Grid */}
        {images && images.length > 0 ? (
          <Row className="g-3">
            {images.map((img) => (
              <Col xs={6} md={4} lg={3} key={img.id}>
                <Card className="border shadow-sm h-100 overflow-hidden">
                  <div style={{ position: 'relative', overflow: 'hidden', height: '160px' }}>
                    <img
                      src={img.url || img.imagePath}
                      alt="Trip"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: img.isPrimary ? 'brightness(1.1)' : 'brightness(1)',
                      }}
                    />
                    {img.isPrimary && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#28a745',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <HiOutlineCheck size={14} /> Primary
                      </div>
                    )}
                  </div>
                  <Card.Body className="p-2 d-flex gap-2 justify-content-between">
                    {!img.isPrimary && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-primary p-0 text-decoration-none flex-fill"
                        onClick={() => handleSetPrimary(img.id)}
                        disabled={setPrimaryImage.isPending}
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0 flex-fill"
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={deleteImage.isPending}
                    >
                      <HiOutlineTrash size={16} />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 text-muted">
            <p>No images uploaded yet. Upload some to get started!</p>
          </div>
        )}

        {(uploadImages.isPending || deleteImage.isPending || setPrimaryImage.isPending) && (
          <div className="mt-3 text-center">
            <Spinner animation="border" size="sm" className="me-2" />
            <span className="small text-muted">Processing...</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
