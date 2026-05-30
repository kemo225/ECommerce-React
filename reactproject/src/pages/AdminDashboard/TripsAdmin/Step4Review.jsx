import { Table } from 'react-bootstrap';

export default function Step4Review({ formData, tripTypes }) {
  const getTripTypeName = (typeId) => {
    const type = tripTypes.find(t => t.id === parseInt(typeId));
    return type?.name || 'Unknown';
  };

  const renderMultilingualField = (field) => {
    if (!field || typeof field !== 'object') return 'N/A';
    return field.en || Object.values(field).find(v => v) || 'N/A';
  };

  return (
    <div>
      <h5 className="fw-bold mb-4">Review Trip Details</h5>
      <p className="text-muted mb-4">Please review all information before submitting</p>

      <Table hover borderless className="bg-light rounded overflow-hidden">
        <tbody>
          <tr>
            <td className="fw-semibold" style={{ width: '30%' }}>Trip Name (EN)</td>
            <td>{renderMultilingualField(formData.name)}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Destination (EN)</td>
            <td>{renderMultilingualField(formData.destination)}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Description</td>
            <td className="text-truncate" style={{ maxWidth: '300px' }}>
              {renderMultilingualField(formData.description)}
            </td>
          </tr>
          <tr>
            <td className="fw-semibold">Trip Type</td>
            <td>{getTripTypeName(formData.tripTypeId)}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Duration</td>
            <td>{formData.durationValue} {formData.durationType}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Start Time</td>
            <td>{formData.timeFrom ? new Date(formData.timeFrom).toLocaleString() : 'Not set'}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Adult Price</td>
            <td>${formData.adultPrice?.toFixed(2) || '0.00'}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Child Price</td>
            <td>${formData.childPrice?.toFixed(2) || '0.00'}</td>
          </tr>
          <tr>
            <td className="fw-semibold">Available Days</td>
            <td>
              {Array.isArray(formData.availabilityDays) && formData.availabilityDays.length > 0
                ? `${formData.availabilityDays.length} day(s) selected`
                : 'None selected'}
            </td>
          </tr>
          <tr>
            <td className="fw-semibold">Highlights</td>
            <td>{Array.isArray(formData.highlights) ? formData.highlights.length : 0} items</td>
          </tr>
          <tr>
            <td className="fw-semibold">Includes</td>
            <td>{Array.isArray(formData.includes) ? formData.includes.length : 0} items</td>
          </tr>
          <tr>
            <td className="fw-semibold">Excludes</td>
            <td>{Array.isArray(formData.excludes) ? formData.excludes.length : 0} items</td>
          </tr>
          <tr>
            <td className="fw-semibold">What to Bring</td>
            <td>{Array.isArray(formData.whatToBring) ? formData.whatToBring.length : 0} items</td>
          </tr>
          <tr>
            <td className="fw-semibold">Status</td>
            <td>
              <span className={`badge ${formData.isActive ? 'bg-success' : 'bg-secondary'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
          </tr>
        </tbody>
      </Table>

      <div className="alert alert-info mt-4">
        <p className="mb-0 small">
          All data looks correct? Click "Save" to submit. You can manage images after creation/update.
        </p>
      </div>
    </div>
  );
}
