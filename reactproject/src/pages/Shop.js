import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainSectionShop from '../components/MainSectionShop';
import DiscountCartWirhoutDiscount from '../components/DiscountCartWirhoutDiscount';

import headphone1 from "../headphone1.jpg";
import headphone2 from "../headphone2.jpg";

import { useState } from 'react';

function Shop() {

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ================= PRODUCTS =================
  const Allproducts = [

    { id: 1, img: headphone1, title: "Phone Card", price: 100, type: "Phone" },
    { id: 2, img: headphone2, title: "Karim Card", price: 150, type: "Phone" },
    { id: 3, img: headphone2, title: "Third Card", price: 200, type: "Phone" },

    { id: 4, img: headphone1, title: "Watch Card", price: 100, type: "Watch" },
    { id: 5, img: headphone2, title: "Second Watch", price: 150, type: "Watch" },

    { id: 6, img: headphone1, title: "Screen Card", price: 100, type: "Screen" },
    { id: 7, img: headphone2, title: "Third Screen Card", price: 200, type: "Screen" },

  ];

  // ================= CATEGORIES =================
  const FilterCategory = [
    "All",
    "Phone",
    "Watch",
    "Screen"
  ];

  // ================= FILTER PRODUCTS =================
  const filteredProducts = Allproducts.filter(item => {

    const matchCategory =
      selectedCategory === "All"
        ? true
        : item.type === selectedCategory;

    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <>

      <MainSectionShop />

      {/* ================= SEARCH + FILTER ================= */}
      <div className='container py-5'>

        <div className='row justify-content-center align-items-center g-4'>

          {/* SEARCH */}
          <div className='col-12 col-md-8'>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search Product..."
              className="form-control py-3 px-4 shadow-soft"
              style={{
                borderRadius: "16px",
                fontSize: "16px",
                border: "1px solid #e2e8f0",
                backgroundColor: "var(--color-white)"
              }}
            />

          </div>

          {/* DROPDOWN */}
          <div className='col-12 col-md-3'>

            <select
              className='form-select py-3 shadow-soft'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                backgroundColor: "var(--color-white)"
              }}
            >

              {FilterCategory.map((item, index) => (

                <option key={index} value={item}>
                  {item}
                </option>

              ))}

            </select>

          </div>

        </div>

      </div>

      {/* ================= PRODUCTS ================= */}
      <div className='container'>

        <div className="row justify-content-center gap-4 pb-5">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((item) => (

              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={item.id}
              >

                <DiscountCartWirhoutDiscount
                  id={item.id}
                  img={item.img}
                  title={item.title}
                  price={item.price}
                />

              </div>

            ))

          ) : (

            <div className='text-center py-5'>

              <h2 className='fw-bold text-secondary'>
                Product Not Found
              </h2>

            </div>

          )}

        </div>

      </div>

    </>
  );
}

export default Shop;