import ImageManagement from './ImageManagement';

// Thin wrapper to match component naming in plan
export default function TripImagesManager({ tripId, images, onUpdate }) {
  return (
    <div>
      <ImageManagement tripId={tripId} images={images} onImageUpdate={onUpdate} />
    </div>
  );
}
