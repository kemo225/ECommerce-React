import React, { useState,useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { ChartContext } from "../App";

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
const { ChartValue } = useContext(ChartContext);

  // Close menu when a link is clicked (better mobile UX)
  const handleNavLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top glass-effect shadow-soft" style={{ minHeight: '70px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* 1. LEFT: Logo */}
        <NavLink 
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-3" 
          to="/" 
          style={{ color: 'var(--color-slate-900)' }}
        >
          <FaShoppingBag style={{ color: 'var(--color-sky-500)', fontSize: '28px' }} />
          <span className="d-none d-sm-inline" style={{ letterSpacing: '-0.5px' }}>Store</span>
        </NavLink>

        {/* 2. RIGHT CONTAINER: Links + Cart + Toggle */}
        <div className="d-flex align-items-center">
          
          {/* NAVIGATION LINKS (Desktop) */}
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav gap-lg-4 fs-6 fw-bold">
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/" onClick={handleNavLinkClick}>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/shop" onClick={handleNavLinkClick}>Shop</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/cart" onClick={handleNavLinkClick}>Cart</NavLink>
              </li>
            </ul>
          </div>

          {/* CART ICON (Always far right) */}
          <NavLink 
            to="/cart" 
            className="btn border-0 position-relative ms-2 ms-lg-4 d-flex align-items-center justify-content-center"
            style={{ padding: '10px', backgroundColor: 'var(--color-light-gray)', borderRadius: '50%', transition: 'all 0.3s ease' }}
          >
            <FaShoppingCart style={{ fontSize: '20px', color: 'var(--color-slate-800)' }} />
            <span 
              className="position-absolute badge rounded-pill" 
              style={{ top: '-2px', right: '-2px', fontSize: '11px', backgroundColor: 'var(--color-sky-500)' }}
            >
            {ChartValue}
            </span>
          </NavLink>

          {/* MOBILE TOGGLE (Visible only on small screens) */}
          <button
            className="navbar-toggler ms-3 border-0 shadow-none"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--color-light-gray)' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

      </div>

      {/* MOBILE MENU (Drop down style when open) */}
      <style>{`
        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            border-bottom: 1px solid #eee;
            z-index: 1000;
          }
        }
        .nav-link.active {
          color: #0dcaf0 !important;
        }
      `}</style>
    </nav>
  );
}

export default Header;