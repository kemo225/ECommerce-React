import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useTrip } from '../../../hooks/useTrips';
import TripFormWizard from './TripFormWizard';
import ImageManagement from '../../../components/ImageManagement';
import { Spinner, Row, Col } from 'react-bootstrap';
import ErrorComponent from '../../../components/ui/Error';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data, isLoading, isError, error, refetch } = useTrip(id);

  const trip = data?.data ?? data;

  const handleClose = () => {
    navigate('/dashboard/trips');
  };

  const handleSuccess = () => {
    navigate('/dashboard/trips');
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading trip details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-5">
        <ErrorComponent 
          message={error?.response?.data?.message || error?.message} 
          onRetry={refetch} 
        />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container py-5 text-center">
        <p className="fs-5 text-muted">{t('tripNotFound')}</p>
        <button className="btn btn-primary" onClick={handleClose}>
          {t('backToTrips')}
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h2 className="fw-bold">{t('editTrip')}</h2>
        <p className="text-muted">Update trip details and manage images</p>
      </div>
      
      <Row>
        <Col lg={7}>
          <TripFormWizard 
            isEdit={true} 
            initialData={trip}
            onSuccess={handleSuccess} 
            onCancel={handleClose} 
          />
        </Col>
        <Col lg={5}>
          <div className="sticky-top" style={{ top: '80px' }}>
            <ImageManagement 
              tripId={id} 
              images={trip?.images || []}
              onImageUpdate={refetch}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
