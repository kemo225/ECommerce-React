import React, { useState } from 'react';
import { Table, Button, Badge, Spinner, Form } from 'react-bootstrap';
import { HiOutlinePencilAlt, HiOutlineEye, HiOutlineRefresh, HiOutlineTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import TripImageGallery from './TripImageGallery';

export default function TripTable({ 
  trips = [], 
  isLoading, 
  onDeactivate, 
  onReactivate,
  deactivatePending,
  reactivatePending
}) {
  const [selectedGallery, setSelectedGallery] = useState(null);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2 small">Fetching voyages...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-5 bg-dark bg-opacity-25 rounded border border-secondary border-opacity-25 my-3">
        <p className="text-muted mb-0 small">No voyages found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <Table hover className="align-middle border-secondary border-opacity-10 text-white">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '80px' }}>Image</th>
              <th>Name</th>
              <th>Destination</th>
              <th>Trip Type</th>
              <th>Prices (Adult/Child)</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Created At</th>
              <th className="text-end" style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => {
              const formattedDate = trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A';
              const primaryImage = trip.images?.find(img => img.isPrimary)?.imageUrl || trip.images?.[0]?.imageUrl || '';

              return (
                <tr key={trip.id} className="border-secondary border-opacity-25">
                  <td>
                    {primaryImage ? (
                      <img 
                        src={primaryImage} 
                        alt={trip.title} 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div 
                        className="bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center text-white-50"
                        style={{ width: '48px', height: '48px', borderRadius: '8px', fontSize: '9px', fontWeight: 'bold' }}
                      >
                        NO IMG
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="fw-semibold small">{trip.title}</div>
                  </td>
                  <td>
                    <span className="small text-white-50">{trip.destination}</span>
                  </td>
                  <td>
                    <Badge bg="secondary" className="bg-opacity-25 text-white-50 border border-secondary border-opacity-50">
                      {trip.tripTypeName || 'General'}
                    </Badge>
                  </td>
                  <td>
                    <div className="small">
                      <span className="text-success fw-bold">${trip.adultPrice}</span>
                      <span className="text-muted"> / </span>
                      <span className="text-info fw-bold">${trip.childPrice}</span>
                    </div>
                  </td>
                  <td>
                    <span className="small text-white-50">{trip.duration}</span>
                  </td>
                  <td>
                    {trip.isInactive ? (
                      <Badge bg="danger" pill>Inactive</Badge>
                    ) : (
                      <Badge bg="success" pill>Active</Badge>
                    )}
                  </td>
                  <td>
                    <span className="small text-white-50">{formattedDate}</span>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <Button 
                        variant="light" 
                        size="sm" 
                        className="text-primary bg-opacity-10"
                        onClick={() => setSelectedGallery(trip)}
                        title="View Gallery"
                      >
                        <HiOutlineEye />
                      </Button>
                      <Button 
                        as={Link}
                        to={`/dashboard/trips/${trip.id}/edit`}
                        variant="light" 
                        size="sm" 
                        className="text-warning bg-opacity-10" 
                        title="Edit Voyage"
                      >
                        <HiOutlinePencilAlt />
                      </Button>
                      {trip.isInactive ? (
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="text-success bg-opacity-10" 
                          onClick={() => onReactivate(trip.id)}
                          disabled={reactivatePending}
                          title="Reactivate"
                        >
                          <HiOutlineRefresh />
                        </Button>
                      ) : (
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="text-danger bg-opacity-10" 
                          onClick={() => onDeactivate(trip.id)}
                          disabled={deactivatePending}
                          title="Deactivate"
                        >
                          <HiOutlineTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {selectedGallery && (
        <TripImageGallery
          show={!!selectedGallery}
          onHide={() => setSelectedGallery(null)}
          images={selectedGallery.images}
          tripName={selectedGallery.title}
        />
      )}
    </>
  );
}
