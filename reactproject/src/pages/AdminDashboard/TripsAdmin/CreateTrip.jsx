import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import TripFormWizard from './TripFormWizard';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClose = () => {
    navigate('/dashboard/trips');
  };

  const handleSuccess = () => {
    navigate('/dashboard/trips');
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">{t('createNewTrip')}</h2>
        <p className="text-muted">{t('createTripDescription')}</p>
      </div>
      
      <TripFormWizard isEdit={false} onSuccess={handleSuccess} onCancel={handleClose} />
    </div>
  );
}
