import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Spinner, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTripTypes } from '../../hooks/useTripTypes';
import MultilingualInput from './MultilingualInput';
import MultilingualTextarea from './MultilingualTextarea';
import DynamicTranslationArray from './DynamicTranslationArray';
import AvailabilitySelector from './AvailabilitySelector';

const multilingualStringSchema = z.object({
  en: z.string().min(2, 'English translation must be at least 2 characters'),
  fr: z.string().default(''),
  ru: z.string().default(''),
  it: z.string().default(''),
  ro: z.string().default(''),
  es: z.string().default(''),
  de: z.string().default(''),
  bl: z.string().default(''),
});

const tripFormSchema = z.object({
  name: multilingualStringSchema,
  destination: multilingualStringSchema,
  description: multilingualStringSchema,
  timeFrom: z.string().min(1, 'Time is required'),
  durationValue: z.coerce.number().min(1, 'Duration value must be greater than 0'),
  durationType: z.coerce.number().default(0),
  adultPrice: z.coerce.number().min(1, 'Adult price must be greater than 0'),
  childPrice: z.coerce.number().min(0, 'Child price must be 0 or greater'),
  tripTypeId: z.coerce.number().min(1, 'Trip type is required'),
  availabilityDayNo: z.array(z.coerce.number()).min(1, 'Select at least one day'),
  highlights: z.array(multilingualStringSchema).default([]),
  includes: z.array(multilingualStringSchema).default([]),
  excludes: z.array(multilingualStringSchema).default([]),
  whatToBring: z.array(multilingualStringSchema).default([]),
});

const formatTimeOnly = (timeStr) => {
  if (!timeStr) return '09:00:00';
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  if (/^\d{2}:\d{2}$/.test(timeStr)) return `${timeStr}:00`;
  return timeStr;
};

const parseTimeForInput = (timeStr) => {
  if (!timeStr) return '09:00';
  const match = timeStr.match(/^(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  return '09:00';
};

export default function TripForm({ initialData, onSubmit, isPending }) {
  const { data: tripTypesData } = useTripTypes();
  const tripTypesList = Array.isArray(tripTypesData)
    ? tripTypesData
    : (tripTypesData?.data || []);

  const [syncLang, setSyncLang] = useState('en');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      name: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      destination: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      description: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      timeFrom: '09:00',
      durationValue: 1,
      durationType: 0,
      adultPrice: '',
      childPrice: '',
      tripTypeId: '',
      availabilityDayNo: [0, 1, 2, 3, 4, 5, 6],
      highlights: [],
      includes: [],
      excludes: [],
      whatToBring: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      const mapTranslation = (field) => {
        // Map from API flat string value or standard translation structure
        if (typeof field === 'object' && field !== null) {
          return {
            en: field.en || '',
            fr: field.fr || '',
            ru: field.ru || '',
            it: field.it || '',
            ro: field.ro || '',
            es: field.es || '',
            de: field.de || '',
            bl: field.bl || '',
          };
        }
        return { en: field || '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' };
      };

      const mapList = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => mapTranslation(item));
      };

      const parseAvailableDays = (days) => {
        if (!Array.isArray(days)) return [0, 1, 2, 3, 4, 5, 6];
        const daysMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        return days.map(d => daysMap[d] !== undefined ? daysMap[d] : Number(d));
      };

      reset({
        name: mapTranslation(initialData.name),
        destination: mapTranslation(initialData.destination),
        description: mapTranslation(initialData.description),
        timeFrom: parseTimeForInput(initialData.timeFrom),
        durationValue: initialData.durationValue || 1,
        durationType: initialData.durationType !== undefined ? Number(initialData.durationType) : 0,
        adultPrice: initialData.adultPrice || '',
        childPrice: initialData.childPrice || 0,
        tripTypeId: initialData.tripTypeId || initialData.typeId || '',
        availabilityDayNo: initialData.availabilityDayNo || parseAvailableDays(initialData.availableDays),
        highlights: mapList(initialData.highlights),
        includes: mapList(initialData.includes),
        excludes: mapList(initialData.excludes),
        whatToBring: mapList(initialData.whatToBring),
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      timeFrom: formatTimeOnly(data.timeFrom),
      durationValue: Number(data.durationValue),
      durationType: Number(data.durationType),
      adultPrice: Number(data.adultPrice),
      childPrice: Number(data.childPrice),
      tripTypeId: Number(data.tripTypeId),
      availabilityDayNo: data.availabilityDayNo.map(Number),
    };
    onSubmit(payload);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card className="bg-dark border-secondary border-opacity-25 text-white shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <MultilingualInput
                name="name"
                register={register}
                errors={errors}
                label="Voyage Name"
                syncLang={syncLang}
                onSyncLangChange={setSyncLang}
              />
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-white-50">Trip Type</Form.Label>
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
              <MultilingualTextarea
                name="description"
                register={register}
                errors={errors}
                label="Description"
                syncLang={syncLang}
                onSyncLangChange={setSyncLang}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MultilingualInput
                name="destination"
                register={register}
                errors={errors}
                label="Destination"
                syncLang={syncLang}
                onSyncLangChange={setSyncLang}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-white-50">Departure Time (Time From)</Form.Label>
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
                <Form.Label className="small text-white-50">Duration Value</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  className="bg-dark text-white border-secondary border-opacity-50"
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
                <Form.Label className="small text-white-50">Duration Unit</Form.Label>
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-white-50">Adult Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1200"
                  className="bg-dark text-white border-secondary border-opacity-50"
                  isInvalid={!!errors.adultPrice}
                  {...register('adultPrice')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.adultPrice?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-white-50">Child Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="600"
                  className="bg-dark text-white border-secondary border-opacity-50"
                  isInvalid={!!errors.childPrice}
                  {...register('childPrice')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.childPrice?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <AvailabilitySelector
                register={register}
                errors={errors}
                name="availabilityDayNo"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Dynamic Arrays */}
      <Card className="bg-dark border-secondary border-opacity-25 text-white shadow-sm mb-4">
        <Card.Body className="p-4">
          <DynamicTranslationArray
            name="highlights"
            control={control}
            register={register}
            errors={errors}
            label="Highlights"
            addButtonLabel="Add Highlight"
            syncLang={syncLang}
            onSyncLangChange={setSyncLang}
          />
          
          <DynamicTranslationArray
            name="includes"
            control={control}
            register={register}
            errors={errors}
            label="Included Items"
            addButtonLabel="Add Included Item"
            syncLang={syncLang}
            onSyncLangChange={setSyncLang}
          />

          <DynamicTranslationArray
            name="excludes"
            control={control}
            register={register}
            errors={errors}
            label="Excluded Items"
            addButtonLabel="Add Excluded Item"
            syncLang={syncLang}
            onSyncLangChange={setSyncLang}
          />

          <DynamicTranslationArray
            name="whatToBring"
            control={control}
            register={register}
            errors={errors}
            label="What to Bring"
            addButtonLabel="Add Item"
            syncLang={syncLang}
            onSyncLangChange={setSyncLang}
          />
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 sticky-bottom p-3 bg-dark bg-opacity-75 border-top border-secondary border-opacity-25 rounded-4 shadow-lg mb-4" style={{ zIndex: 100 }}>
        <Button 
          variant="secondary" 
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isPending}
          className="d-flex align-items-center gap-1"
        >
          {isPending ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Voyage</span>
          )}
        </Button>
      </div>
    </Form>
  );
}
