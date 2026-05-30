import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { z } from 'zod';
import { useLanguage } from '../../../context/LanguageContext';
import { useCreateTrip, useUpdateTrip } from '../../../hooks/useTrips';
import { useTripTypes } from '../../../hooks/useTripTypes';
import toast from 'react-hot-toast';
import Step1BasicInfo from './Step1BasicInfo';
import Step2TripDetails from './Step2TripDetails';
import Step3Lists from './Step3Lists';
import Step4Review from './Step4Review';
import styles from './TripFormWizard.module.css';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ru', 'it', 'ro', 'es', 'de', 'bl'];

// Multilingual string schema
const multilingualStringSchema = z.object(
  SUPPORTED_LANGUAGES.reduce((acc, lang) => {
    acc[lang] = z.string().optional().default('');
    return acc;
  }, {})
).refine((data) => data.en && data.en.trim().length > 0, {
  message: 'English version is required',
});

const tripSchema = z.object({
  name: multilingualStringSchema,
  destination: multilingualStringSchema,
  description: multilingualStringSchema,
  timeFrom: z.string().optional().default(''),
  durationValue: z.coerce.number().min(1, 'Duration must be at least 1'),
  durationType: z.enum(['days', 'hours']).default('days'),
  adultPrice: z.coerce.number().min(0, 'Adult price must be >= 0'),
  childPrice: z.coerce.number().min(0, 'Child price must be >= 0'),
  tripTypeId: z.coerce.number().min(1, 'Trip type is required'),
  availabilityDays: z.array(z.number()).min(1, 'At least one day required'),
  highlights: z.array(z.any()).default([]),
  includes: z.array(z.any()).default([]),
  excludes: z.array(z.any()).default([]),
  whatToBring: z.array(z.any()).default([]),
  isActive: z.boolean().default(true),
});

export default function TripFormWizard({ isEdit, initialData, onSuccess, onCancel }) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataSteps, setFormDataSteps] = useState({
    step1: {},
    step2: {},
    step3: {},
  });

  const { data: tripTypesData } = useTripTypes();
  const tripTypes = Array.isArray(tripTypesData) ? tripTypesData : (tripTypesData?.data || []);

  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: getDefaultValues(initialData),
  });

  function getDefaultValues(data) {
    if (!data) {
      return {
        name: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
        destination: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
        description: { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
        timeFrom: '',
        durationValue: 1,
        durationType: 'days',
        adultPrice: 0,
        childPrice: 0,
        tripTypeId: 0,
        availabilityDays: [],
        highlights: [],
        includes: [],
        excludes: [],
        whatToBring: [],
        isActive: true,
      };
    }

    return {
      name: data.name || { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      destination: data.destination || { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      description: data.description || { en: '', fr: '', ru: '', it: '', ro: '', es: '', de: '', bl: '' },
      timeFrom: data.timeFrom || '',
      durationValue: data.durationValue || 1,
      durationType: data.durationType || 'days',
      adultPrice: data.adultPrice || 0,
      childPrice: data.childPrice || 0,
      tripTypeId: data.tripTypeId || 0,
      availabilityDays: data.availabilityDays || [],
      highlights: data.highlights || [],
      includes: data.includes || [],
      excludes: data.excludes || [],
      whatToBring: data.whatToBring || [],
      isActive: data.isActive !== false,
    };
  }

  const isLoading = createTrip.isPending || updateTrip.isPending;
  const totalSteps = isEdit ? 5 : 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      highlights: data.highlights.map(h => typeof h === 'string' ? h : h.translations || h),
      includes: data.includes.map(i => typeof i === 'string' ? i : i.translations || i),
      excludes: data.excludes.map(e => typeof e === 'string' ? e : e.translations || e),
      whatToBring: data.whatToBring.map(w => typeof w === 'string' ? w : w.translations || w),
    };

    if (isEdit && initialData?.id) {
      updateTrip.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Trip updated successfully');
            onSuccess?.();
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update trip');
          },
        }
      );
    } else {
      createTrip.mutate(payload, {
        onSuccess: () => {
          toast.success('Trip created successfully');
          onSuccess?.();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Failed to create trip');
        },
      });
    }
  };

  return (
    <Container fluid className={styles.wizard}>
      <Row className="mb-4">
        <Col>
          <ProgressBar now={progress} label={`Step ${currentStep} of ${totalSteps}`} className={styles.progressBar} />
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {currentStep === 1 && (
                  <Step1BasicInfo register={register} errors={errors} />
                )}
                {currentStep === 2 && (
                  <Step2TripDetails 
                    register={register} 
                    errors={errors}
                    control={control}
                    tripTypes={tripTypes}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Lists 
                    register={register} 
                    errors={errors}
                    control={control}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Review 
                    formData={watch()}
                    tripTypes={tripTypes}
                  />
                )}
                {isEdit && currentStep === 5 && (
                  <ImageUploadStep tripId={initialData?.id} />
                )}

                {/* Navigation Buttons */}
                <div className={`d-flex gap-3 justify-content-between mt-5 ${styles.buttonGroup}`}>
                  <Button 
                    variant="outline-secondary"
                    onClick={currentStep === 1 ? onCancel : handlePrevious}
                    disabled={isLoading}
                  >
                    <HiOutlineArrowLeft className="me-2" />
                    {currentStep === 1 ? t('cancel') : t('previous')}
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button 
                      variant="primary"
                      onClick={handleNext}
                      disabled={isLoading || Object.keys(errors).length > 0}
                    >
                      {t('next')}
                      <HiOutlineArrowRight className="ms-2" />
                    </Button>
                  ) : (
                    <Button 
                      variant="success"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : t('save')}
                    </Button>
                  )}
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function ImageUploadStep({ tripId }) {
  const { t } = useLanguage();
  return (
    <div>
      <h5 className="fw-bold mb-3">Image Management</h5>
      <p className="text-muted">Manage trip images in the edit panel.</p>
    </div>
  );
}
