import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';
import { 
  useCreateTrip, 
  useUpdateTrip, 
  useUploadTripImages, 
  useDeleteTripImage, 
  useSetPrimaryImage, 
  useTrip 
} from '../../../hooks/useTrips';
import { useTripTypes } from '../../../hooks/useTripTypes';
import { useLanguage } from '../../../context/LanguageContext';

const tripSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(2, 'Destination is required'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  duration: z.string().min(1, 'Duration is required'),
  rating: z.coerce.number().min(0).max(5).optional(),
  typeId: z.coerce.number().min(1, 'Type is required'),
  highlights: z.array(z.object({ value: z.string() })).default([]),
  includes: z.array(z.object({ value: z.string() })).default([]),
  excludes: z.array(z.object({ value: z.string() })).default([]),
  whatToBring: z.array(z.object({ value: z.string() })).default([]),
});

export default function TripForm({ show, handleClose, initialData }) {
  const isEdit = !!initialData;
  const { t } = useLanguage();
  const { data: tripTypesData } = useTripTypes();
  const tripTypesList = Array.isArray(tripTypesData)
    ? tripTypesData
    : (tripTypesData?.data || []);
  const [activeTab, setActiveTab] = useState('general');

  // Query actual updated trip data (to get dynamic list of images/fields) when editing
  const { data: updatedTripData } = useTrip(initialData?.id);
  const tripDetails = updatedTripData?.data ?? updatedTripData ?? initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: '',
      destination: '',
      price: '',
      duration: '',
      rating: 5,
      typeId: '',
      highlights: [],
      includes: [],
      excludes: [],
      whatToBring: [],
    },
  });

  // Dynamic lists mapping using useFieldArray
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights',
  });
  const { fields: includeFields, append: appendInclude, remove: removeInclude } = useFieldArray({
    control,
    name: 'includes',
  });
  const { fields: excludeFields, append: appendExclude, remove: removeExclude } = useFieldArray({
    control,
    name: 'excludes',
  });
  const { fields: whatToBringFields, append: appendWhatToBring, remove: removeWhatToBring } = useFieldArray({
    control,
    name: 'whatToBring',
  });

  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  // Image Upload and Mutation Hooks
  const uploadImages = useUploadTripImages();
  const deleteImage = useDeleteTripImage();
  const setPrimaryImage = useSetPrimaryImage();

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (show) {
      setActiveTab('general');
      setSelectedFile(null);
    }
  }, [show]);

  useEffect(() => {
    if (tripDetails && show) {
      // Map arrays of strings to array of objects expected by useFieldArray
      const mapToArrayOfObjects = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(val => (typeof val === 'string' ? { value: val } : { value: val?.value ?? '' }));
      };

      reset({
        title: tripDetails.title || '',
        destination: tripDetails.destination || '',
        price: tripDetails.price || '',
        duration: tripDetails.duration || '',
        rating: tripDetails.rating || 5,
        typeId: tripDetails.typeId || '',
        highlights: mapToArrayOfObjects(tripDetails.highlights),
        includes: mapToArrayOfObjects(tripDetails.includes),
        excludes: mapToArrayOfObjects(tripDetails.excludes),
        whatToBring: mapToArrayOfObjects(tripDetails.whatToBring),
      });
    } else {
      reset({
        title: '',
        destination: '',
        price: '',
        duration: '',
        rating: 5,
        typeId: '',
        highlights: [],
        includes: [],
        excludes: [],
        whatToBring: [],
      });
    }
  }, [tripDetails, reset, show]);

  const onSubmit = (data) => {
    // Map objects back to flat string arrays for the API payload
    const payload = {
      ...data,
      highlights: data.highlights.map(h => h.value).filter(Boolean),
      includes: data.includes.map(i => i.value).filter(Boolean),
      excludes: data.excludes.map(e => e.value).filter(Boolean),
      whatToBring: data.whatToBring.map(w => w.value).filter(Boolean),
    };

    if (isEdit) {
      updateTrip.mutate(
        { id: tripDetails.id, data: payload },
        {
          onSuccess: () => handleClose(),
        }
      );
    } else {
      createTrip.mutate(payload, {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    uploadImages.mutate(
      { id: tripDetails.id, formData },
      {
        onSuccess: () => {
          setSelectedFile(null);
          // Reset file input
          const fileInput = document.getElementById('tripImageFileInput');
          if (fileInput) fileInput.value = '';
        },
      }
    );
  };

  const handleSetPrimary = (imageId) => {
    setPrimaryImage.mutate({ id: tripDetails.id, imageId });
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage.mutate({ id: tripDetails.id, imageId });
    }
  };

  const isPending = createTrip.isPending || updateTrip.isPending;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? t('editTrip') : t('createNewTrip')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white p-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="nav-tabs-custom border-bottom border-secondary border-opacity-25"
          fill
        >
          <Tab eventKey="general" title="General Details" className="p-4">
            <Form onSubmit={handleSubmit(onSubmit)} id="adminTripMainForm">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trip Title</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. Kyoto dawn explorer"
                      isInvalid={!!errors.title}
                      {...register('title')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('tripType')}</Form.Label>
                    <Form.Select
                      className="bg-dark text-white border-secondary border-opacity-50"
                      isInvalid={!!errors.typeId}
                      {...register('typeId')}
                    >
                      <option value="">Select Type</option>
                      {tripTypesList.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.typeId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('destination')}</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. Japan"
                      isInvalid={!!errors.destination}
                      {...register('destination')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.destination?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('duration')}</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. 5 days"
                      isInvalid={!!errors.duration}
                      {...register('duration')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.duration?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="1500"
                      isInvalid={!!errors.price}
                      {...register('price')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="4.8"
                      isInvalid={!!errors.rating}
                      {...register('rating')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rating?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="lists" title="Highlights & Includes" className="p-4">
            <Form onSubmit={handleSubmit(onSubmit)} id="adminTripListsForm">
              {/* Highlights Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">{t('highlights')}</h6>
                  <Button variant="outline-primary" size="sm" onClick={() => appendHighlight({ value: '' })}>
                    <HiOutlinePlus /> Add Highlight
                  </Button>
                </div>
                {highlightFields.map((field, index) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="Highlight entry..."
                      {...register(`highlights.${index}.value`)}
                    />
                    <Button variant="danger" size="sm" onClick={() => removeHighlight(index)}>
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Includes Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">{t('includes')}</h6>
                  <Button variant="outline-primary" size="sm" onClick={() => appendInclude({ value: '' })}>
                    <HiOutlinePlus /> Add Included
                  </Button>
                </div>
                {includeFields.map((field, index) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="Included entry..."
                      {...register(`includes.${index}.value`)}
                    />
                    <Button variant="danger" size="sm" onClick={() => removeInclude(index)}>
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Excludes Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">{t('excludes')}</h6>
                  <Button variant="outline-primary" size="sm" onClick={() => appendExclude({ value: '' })}>
                    <HiOutlinePlus /> Add Excluded
                  </Button>
                </div>
                {excludeFields.map((field, index) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="Excluded entry..."
                      {...register(`excludes.${index}.value`)}
                    />
                    <Button variant="danger" size="sm" onClick={() => removeExclude(index)}>
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
              </div>

              {/* What to Bring Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold">{t('whatToBring')}</h6>
                  <Button variant="outline-primary" size="sm" onClick={() => appendWhatToBring({ value: '' })}>
                    <HiOutlinePlus /> Add Item
                  </Button>
                </div>
                {whatToBringFields.map((field, index) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="Item name..."
                      {...register(`whatToBring.${index}.value`)}
                    />
                    <Button variant="danger" size="sm" onClick={() => removeWhatToBring(index)}>
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
              </div>
            </Form>
          </Tab>

          {isEdit && (
            <Tab eventKey="images" title="Voyage Gallery" className="p-4">
              <h6 className="mb-3 fw-bold">{t('uploadImages')}</h6>
              <Form onSubmit={handleImageUpload} className="d-flex gap-2 mb-4">
                <Form.Control
                  id="tripImageFileInput"
                  type="file"
                  accept="image/*"
                  className="bg-dark text-white border-secondary border-opacity-50"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <Button variant="primary" type="submit" disabled={!selectedFile || uploadImages.isPending}>
                  {uploadImages.isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </Form>

              <Row className="g-3">
                {tripDetails?.images?.length === 0 || !tripDetails?.images ? (
                  <div className="text-center text-muted py-4">No images uploaded for this voyage yet.</div>
                ) : (
                  tripDetails.images.map((img) => (
                    <Col xs={6} md={4} key={img.id}>
                      <Card className="bg-dark border-secondary h-100">
                        <Card.Img
                          variant="top"
                          src={img.url || img.imagePath}
                          style={{ height: '120px', objectFit: 'cover' }}
                        />
                        <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                          {img.isPrimary ? (
                            <span className="text-success small d-flex align-items-center gap-1">
                              <HiOutlineCheck /> Primary
                            </span>
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-gold p-0 text-decoration-none small"
                              onClick={() => handleSetPrimary(img.id)}
                              disabled={setPrimaryImage.isPending}
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                            onClick={() => handleDeleteImage(img.id)}
                            disabled={deleteImage.isPending}
                          >
                            <HiOutlineTrash />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </Tab>
          )}
        </Tabs>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary border-opacity-25">
        <Button variant="secondary" onClick={handleClose} disabled={isPending}>
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          type="submit"
          form={activeTab === 'general' ? 'adminTripMainForm' : 'adminTripListsForm'}
          disabled={isPending}
        >
          {isPending ? 'Saving...' : t('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
