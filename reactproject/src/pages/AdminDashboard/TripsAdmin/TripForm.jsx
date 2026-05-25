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
  useSetPrimaryTripImage, 
  useTrip 
} from '../../../hooks/useTrips';
import { useTripTypes } from '../../../hooks/useTripTypes';
import { useLanguage } from '../../../context/LanguageContext';

const tripSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  destination: z.string().min(2, 'Destination is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  adultPrice: z.coerce.number().min(1, 'Adult price must be greater than 0'),
  childPrice: z.coerce.number().min(0, 'Child price must be 0 or greater'),
  durationValue: z.coerce.number().min(1, 'Duration value must be greater than 0'),
  durationType: z.coerce.number().default(0),
  rating: z.coerce.number().min(0).max(5).optional(),
  tripTypeId: z.coerce.number().min(1, 'Type is required'),
  timeFrom: z.string().min(1, 'Time is required'),
  availabilityDayNo: z.array(z.coerce.number()).default([]),
  highlights: z.array(z.object({ value: z.string() })).default([]),
  includes: z.array(z.object({ value: z.string() })).default([]),
  excludes: z.array(z.object({ value: z.string() })).default([]),
  whatToBring: z.array(z.object({ value: z.string() })).default([]),
});

// Robust conversion to ISO 8601 HH:mm:ss for System.TimeOnly deserialization
const formatTimeOnly = (timeStr) => {
  if (!timeStr) return '09:00:00';
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  if (/^\d{2}:\d{2}$/.test(timeStr)) return `${timeStr}:00`;
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${minutes}:00`;
  }
  return timeStr;
};

// Formats backend TimeOnly strings to HH:mm for the native HTML time picker
const parseTimeForInput = (timeStr) => {
  if (!timeStr) return '09:00';
  const match = timeStr.match(/^(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  return '09:00';
};

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
      name: '',
      destination: '',
      description: '',
      adultPrice: '',
      childPrice: '',
      durationValue: 1,
      durationType: 0,
      rating: 5,
      tripTypeId: '',
      timeFrom: '09:00',
      availabilityDayNo: [0, 1, 2, 3, 4, 5, 6],
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
  const setPrimaryImage = useSetPrimaryTripImage();

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (show) {
      setActiveTab('general');
      setSelectedFile(null);
    }
  }, [show]);

  useEffect(() => {
    if (tripDetails && show) {
      const mapToArrayOfObjects = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(val => (typeof val === 'string' ? { value: val } : { value: val?.value ?? '' }));
      };

      const parseAvailableDays = (days) => {
        if (!Array.isArray(days)) return [0, 1, 2, 3, 4, 5, 6];
        const daysMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        return days.map(d => daysMap[d] !== undefined ? daysMap[d] : Number(d));
      };

      reset({
        name: tripDetails.name || tripDetails.title || '',
        destination: tripDetails.destination || '',
        description: tripDetails.description || '',
        adultPrice: tripDetails.adultPrice || tripDetails.price || '',
        childPrice: tripDetails.childPrice || 0,
        durationValue: tripDetails.durationValue || 1,
        durationType: tripDetails.durationType !== undefined ? Number(tripDetails.durationType) : 0,
        rating: tripDetails.rating || 5,
        tripTypeId: tripDetails.tripTypeId || tripDetails.typeId || '',
        timeFrom: parseTimeForInput(tripDetails.timeFrom),
        availabilityDayNo: tripDetails.availabilityDayNo || parseAvailableDays(tripDetails.availableDays),
        highlights: mapToArrayOfObjects(tripDetails.highlights),
        includes: mapToArrayOfObjects(tripDetails.includes),
        excludes: mapToArrayOfObjects(tripDetails.excludes),
        whatToBring: mapToArrayOfObjects(tripDetails.whatToBring),
      });
    } else {
      reset({
        name: '',
        destination: '',
        description: '',
        adultPrice: '',
        childPrice: '',
        durationValue: 1,
        durationType: 0,
        rating: 5,
        tripTypeId: '',
        timeFrom: '09:00',
        availabilityDayNo: [0, 1, 2, 3, 4, 5, 6],
        highlights: [],
        includes: [],
        excludes: [],
        whatToBring: [],
      });
    }
  }, [tripDetails, reset, show]);

  const onSubmit = (data) => {
    const toMultiLang = (val) => ({
      en: val || '',
      fr: val || '',
      ru: val || '',
      de: val || '',
      it: val || '',
      ro: val || '',
      es: val || '',
      bl: val || '',
    });

    const payload = {
      name: toMultiLang(data.name),
      destination: toMultiLang(data.destination),
      description: toMultiLang(data.description),
      timeFrom: formatTimeOnly(data.timeFrom),
      durationValue: Number(data.durationValue),
      durationType: Number(data.durationType),
      adultPrice: Number(data.adultPrice),
      childPrice: Number(data.childPrice),
      tripTypeId: Number(data.tripTypeId),
      availabilityDayNo: data.availabilityDayNo.map(Number),
      highlights: data.highlights.map(h => toMultiLang(h.value)).filter(h => h.en),
      includes: data.includes.map(i => toMultiLang(i.value)).filter(i => i.en),
      excludes: data.excludes.map(e => toMultiLang(e.value)).filter(e => e.en),
      whatToBring: data.whatToBring.map(w => toMultiLang(w.value)).filter(w => w.en),
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
    // Parameter name MUST be 'Images' matching Swagger file-upload array parameters
    formData.append('Images', selectedFile);

    uploadImages.mutate(
      { id: tripDetails.id, formData },
      {
        onSuccess: () => {
          setSelectedFile(null);
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
                    <Form.Label>Trip Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. Kyoto dawn explorer"
                      isInvalid={!!errors.name}
                      {...register('name')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('tripType')}</Form.Label>
                    <Form.Select
                      className="bg-dark text-white border-secondary border-opacity-50"
                      isInvalid={!!errors.tripTypeId}
                      {...register('tripTypeId')}
                    >
                      <option value="">Select Type</option>
                      {tripTypesList.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.tripTypeId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="Write a compelling description for this trip..."
                      isInvalid={!!errors.description}
                      {...register('description')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description?.message}
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
                    <Form.Label>Time From</Form.Label>
                    <Form.Control
                      type="time"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      isInvalid={!!errors.timeFrom}
                      {...register('timeFrom')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.timeFrom?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration Value</Form.Label>
                    <Form.Control
                      type="number"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. 5"
                      isInvalid={!!errors.durationValue}
                      {...register('durationValue')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.durationValue?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration Type</Form.Label>
                    <Form.Select
                      className="bg-dark text-white border-secondary border-opacity-50"
                      isInvalid={!!errors.durationType}
                      {...register('durationType')}
                    >
                      <option value="0">Days</option>
                      <option value="1">Hours</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.durationType?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Adult Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="1500"
                      isInvalid={!!errors.adultPrice}
                      {...register('adultPrice')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.adultPrice?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      className="bg-dark text-white border-secondary border-opacity-50"
                      placeholder="800"
                      isInvalid={!!errors.childPrice}
                      {...register('childPrice')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.childPrice?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
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

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-block mb-2">Available Days</Form.Label>
                    <div className="d-flex flex-wrap gap-3 p-3 bg-secondary bg-opacity-10 rounded border border-secondary border-opacity-25">
                      {[
                        { label: 'Sun', value: 0 },
                        { label: 'Mon', value: 1 },
                        { label: 'Tue', value: 2 },
                        { label: 'Wed', value: 3 },
                        { label: 'Thu', value: 4 },
                        { label: 'Fri', value: 5 },
                        { label: 'Sat', value: 6 },
                      ].map((day) => (
                        <Form.Check
                          key={day.value}
                          type="checkbox"
                          id={`day-${day.value}`}
                          label={day.label}
                          value={day.value}
                          className="text-white-50"
                          {...register('availabilityDayNo')}
                        />
                      ))}
                    </div>
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
                          src={img.imageUrl}
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
