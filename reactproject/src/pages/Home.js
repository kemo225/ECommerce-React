import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import headphone1 from "../headphone1.jpg";
import headphone2 from "../headphone2.jpg";
import watch from "../watch1.jpg";

import Service from "../components/Service";
import Discount from "../components/Discount";
import React, { useState } from "react";

function Home() {
  const [slides] = useState([
    {
      img: watch,
      title: "75% Off Your First Shopping For Watch Section",
      description: "Stone and Beam Westview you are bird so cannot do thing",
    },
    {
      img: headphone2,
      title: "Big Discount on Headphones",
      description: "Premium sound quality with limited time offer",
    },
    {
      img: headphone1,
      title: "Special Offer on Headphones",
      description: "Best deals available only today",
    },
  ]);

  const products = [
    { id: 1, img: headphone1, discount: 5, title: "First Card", price: 100 },
    { id: 2, img: headphone2, discount: 15, title: "Second Card", price: 150 },
    { id: 3, img: headphone2, discount: 20, title: "Third Card", price: 200 },
    { id: 4, img: headphone1, discount: 25, title: "Fourth Card", price: 120 },
    { id: 5, img: headphone2, discount: 90, title: "Fifth Card", price: 180 },
    { id: 6, img: headphone2, discount: 50, title: "Sixth Card", price: 240 },
    { id: 7, img: headphone2, discount: 45, title: "Seventh Card", price: 240 },
  ];

  return (
    <div>
      {/* RESPONSIVE HERO STYLES */}
      <style>{`
        .hero-slide-inner {
          min-height: 80vh;
          display: flex;
          align-items: center;
          background-color: var(--color-sky-100);
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-title {
          color: var(--color-slate-900);
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: clamp(1.5rem, 4vw, 3.5rem);
          line-height: 1.15;
        }

        .hero-desc {
          color: var(--color-slate-500);
          margin-bottom: 1.5rem;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
        }

        .hero-img {
          max-height: 380px;
          width: 100%;
          object-fit: contain;
        }

        /* Nav buttons */
        .hero-prev,
        .hero-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0,0,0,0.55);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s;
        }
        .hero-prev { left: 12px; }
        .hero-next { right: 12px; }
        .hero-prev:hover,
        .hero-next:hover { background: rgba(0,0,0,0.8); }

        /* Mobile tweaks */
        @media (max-width: 767px) {
          .hero-slide-inner { min-height: 100vh; padding: 40px 0 60px; }
          .hero-title { text-align: center; }
          .hero-desc  { text-align: center; }
          .hero-btn-wrap { display: flex; justify-content: center; }
          .hero-img { max-height: 240px; margin-bottom: 16px; }
          .hero-prev { left: 6px; }
          .hero-next { right: 6px; }
        }

        @media (max-width: 480px) {
          .hero-slide-inner { padding: 32px 0 56px; }
          .hero-title { font-size: 1.35rem; }
          .hero-img { max-height: 200px; }
          .hero-prev, .hero-next { width: 32px; height: 32px; font-size: 14px; }
        }
      `}</style>

      {/* CAROUSEL */}
      <div
        id="demo"
        className="carousel slide position-relative"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        data-bs-pause="false"
      >
        {/* INDICATORS */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#demo"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
            />
          ))}
        </div>

        {/* SLIDES */}
        <div className="carousel-inner">
          {slides.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <div className="hero-slide-inner">
                <div className="container">
                  <div className="row align-items-center gy-3">

                    {/* IMAGE — top on mobile */}
                    <div className="col-12 col-md-6 order-1 order-md-2 d-flex justify-content-center align-items-center">
                      <img
                        src={item.img}
                        alt="product"
                        className="hero-img img-fluid"
                      />
                    </div>

                    {/* TEXT — below image on mobile */}
                    <div className="col-12 col-md-6 order-2 order-md-1 hero-text-col">
                      <h1 className="hero-title">{item.title}</h1>
                      <p className="hero-desc">{item.description}</p>
                      <div className="hero-btn-wrap">
                        <button className="btn btnhome shadow-hover px-4 py-2">
                          Visit Store
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PREV */}
        <button
          className="hero-prev"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="prev"
          aria-label="Previous slide"
        >
          &#8249;
        </button>

        {/* NEXT */}
        <button
          className="hero-next"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="next"
          aria-label="Next slide"
        >
          &#8250;
        </button>
      </div>

      {/* OTHER COMPONENTS */}
      <Service />

      <Discount
        tittle="Big Discount"
        products={products}
        backgroundColor="rgb(231, 233, 236)"
      />

      <Discount
        tittle="New Arrivals"
        products={products}
        backgroundColor="rgb(245, 245, 245)"
      />

      <Discount
        tittle="Best Sales"
        products={products}
        backgroundColor="rgb(252, 252, 252)"
      />
    </div>
  );
}

export default Home;