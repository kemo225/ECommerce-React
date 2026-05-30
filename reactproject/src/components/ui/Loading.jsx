import React from 'react';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden placeholder-glow" style={{ borderRadius: '16px', background: 'var(--card-bg, #1e1e24)' }}>
      <div className="placeholder col-12" style={{ height: '220px', backgroundColor: '#2a2a35' }}></div>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="placeholder col-4 py-2 rounded" style={{ backgroundColor: '#2a2a35' }}></span>
          <span className="placeholder col-3 py-2 rounded" style={{ backgroundColor: '#2a2a35' }}></span>
        </div>
        <h5 className="card-title placeholder col-8 py-2 rounded mb-3" style={{ backgroundColor: '#2a2a35' }}></h5>
        <p className="card-text placeholder col-12 py-1 rounded" style={{ backgroundColor: '#2a2a35' }}></p>
        <p className="card-text placeholder col-10 py-1 rounded mb-4" style={{ backgroundColor: '#2a2a35' }}></p>
        
        <div className="row g-2 mb-3 border-top border-bottom py-3 border-secondary border-opacity-25">
          <div className="col-6 placeholder col-4 py-2 rounded" style={{ backgroundColor: '#2a2a35' }}></div>
          <div className="col-6 placeholder col-4 py-2 rounded" style={{ backgroundColor: '#2a2a35' }}></div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="placeholder col-5 py-3 rounded" style={{ backgroundColor: '#2a2a35' }}></span>
          <span className="placeholder col-4 py-3 rounded" style={{ backgroundColor: '#2a2a35' }}></span>
        </div>
      </div>
    </div>
  );
}

export function TripDetailsSkeleton() {
  return (
    <div className="container py-5 placeholder-glow">
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="placeholder col-12 rounded-4 mb-4" style={{ height: '400px', backgroundColor: '#2a2a35' }}></div>
          <div className="d-flex gap-2 mb-4">
            <div className="placeholder col-3 rounded" style={{ height: '80px', backgroundColor: '#2a2a35' }}></div>
            <div className="placeholder col-3 rounded" style={{ height: '80px', backgroundColor: '#2a2a35' }}></div>
            <div className="placeholder col-3 rounded" style={{ height: '80px', backgroundColor: '#2a2a35' }}></div>
          </div>
          <h1 className="placeholder col-8 py-3 rounded mb-3" style={{ backgroundColor: '#2a2a35' }}></h1>
          <p className="placeholder col-12 py-2 rounded" style={{ backgroundColor: '#2a2a35' }}></p>
          <p className="placeholder col-10 py-2 rounded mb-5" style={{ backgroundColor: '#2a2a35' }}></p>
        </div>
        <div className="col-lg-5">
          <div className="card p-4 border-0 rounded-4 shadow-sm" style={{ backgroundColor: '#1e1e24' }}>
            <h3 className="placeholder col-6 py-2 rounded mb-4" style={{ backgroundColor: '#2a2a35' }}></h3>
            <div className="placeholder col-12 py-3 rounded mb-2" style={{ backgroundColor: '#2a2a35' }}></div>
            <div className="placeholder col-12 py-3 rounded mb-2" style={{ backgroundColor: '#2a2a35' }}></div>
            <div className="placeholder col-12 py-3 rounded mb-4" style={{ backgroundColor: '#2a2a35' }}></div>
            <div className="placeholder col-12 py-4 rounded" style={{ backgroundColor: '#2a2a35' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
