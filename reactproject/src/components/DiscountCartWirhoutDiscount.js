import { FaStar } from "react-icons/fa";
import { FaRegHeart  } from "react-icons/fa";   
import { FaPlus } from "react-icons/fa";
import { ChartContext } from "../App";
import React, { useContext } from "react";
function DiscountCartWirhoutDiscount({ id,img,title,price }) {
  const {handleAddToCart}=useContext(ChartContext);
  
  return (
    
   <>
  <div id={id} className="card h-100 w-100 rounded-3 bg-light shadow-md position-relative parent-card-discount">

    <img 
      className="card-img-top img-fluid" 
      src={img} 
      alt="Card" 
    />

    <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
      
      <h4 className="card-title me-auto">{title}</h4>
      <p className="card-text me-auto"><FaStar style={{color:"gold"}} /> <FaStar style={{color:"gold"}}/> <FaStar style={{color:"gold"}}/> <FaStar style={{color:"gold"}}/> <FaStar style={{color:"gold"}}/></p>
      <div className="card-text me-auto justify-content-between align-items-center d-flex w-100">Price: ${price} <div className="plus-discount-card circle d-flex align-items-center justify-content-center " onClick={()=>handleAddToCart({ id, img, title, price }  )}><FaPlus/></div></div>
    </div>
  
     <div className="heart-card">
    <FaRegHeart/>
  </div>
  </div>

   
   </>
  );
}

export default DiscountCartWirhoutDiscount;
