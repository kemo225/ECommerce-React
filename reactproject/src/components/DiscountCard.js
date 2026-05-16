import { FaStar } from "react-icons/fa";
import { FaRegHeart  } from "react-icons/fa";   
import { FaPlus } from "react-icons/fa";
import { ChartContext } from "../App";
import React, { useContext } from "react";

function DiscountCard({ id,img,title,price,discount  }) {

const {handleAddToCart}=useContext(ChartContext);


  return (
    
   <>
  <div id={id} className="card h-100 w-100 bg-white border-0 shadow-soft position-relative parent-card-discount" style={{ borderRadius: '16px' }}>

    <div style={{ padding: '15px' }}>
      <img 
        className="card-img-top img-fluid rounded" 
        src={img} 
        alt="Card" 
        style={{ aspectRatio: '1/1', objectFit: 'cover' }}
      />
    </div>

    <div className="card-body d-flex flex-column pt-0">
      
      <h5 className="card-title fw-bold text-start text-dark mb-1">{title}</h5>
      
      <div className="d-flex mb-3">
        <FaStar style={{color:"#fbbf24", fontSize: "14px"}} /> 
        <FaStar style={{color:"#fbbf24", fontSize: "14px"}}/> 
        <FaStar style={{color:"#fbbf24", fontSize: "14px"}}/> 
        <FaStar style={{color:"#fbbf24", fontSize: "14px"}}/> 
        <FaStar style={{color:"#fbbf24", fontSize: "14px"}}/>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto w-100">
        <span className="fw-bold fs-5" style={{ color: 'var(--color-sky-500)' }}>${price}</span> 
        <div 
          className="circle cursor-pointer shadow-sm" 
          onClick={() => handleAddToCart({ id, img, title, price, discount })}
        >
          <FaPlus className="plus-discount-card"/>
        </div>
      </div>

    </div>
    
    <div className="dis shadow-sm">
      {discount}% OFF
    </div>
    
    <div className="heart-card cursor-pointer">
      <FaRegHeart/>
    </div>
    
  </div>

   
   </>
  );
}

export default DiscountCard;
