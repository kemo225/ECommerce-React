import "../App.css";
import DiscountCard from "./DiscountCard";


function Discount(props) {
  
  return (
    <div className="container-fluid  py-5" style={{backgroundColor:props.backgroundColor}}>
      <div className="container d-flex flex-column align-items-center justify-content-center">

        <h2 className="text-dark fw-bold">
        {props.tittle}
        </h2>

        <div className="row gap-4 justify-content-center py-5">
          {props.products.map((item, index) => (
            <div className="col-md-3 col-10" key={index}>
              <DiscountCard
              id={item.id}
                img={item.img}
                title={item.title}
                price={item.price}
                discount={item.discount} 
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Discount;