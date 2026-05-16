import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainSectionShop from './MainSectionShop';
import DiscountCard from './DiscountCard';
import headphone1 from "../headphone1.jpg";
import headphone2 from "../headphone2.jpg";
function SerchItem() {


  return (
    <>

   <div className='container-fluid py-5'>
    <div className='row gap-4 justify-content-center'>
      <div style={{}} className="dropdown col-2 ">
  <button type="button" className="btn btn-primary dropdown-toggle p-2 px-3" data-bs-toggle="dropdown">
    Search By Category
  </button>
  <ul className="dropdown-menu">
    <li><a className="dropdown-item" href="#">Sofa</a></li>
    <li><a className="dropdown-item" href="#">Chair</a></li>
    <li><a className="dropdown-item" href="#">Wireless</a></li>
        <li><a className="dropdown-item" href="#">Mobil</a></li>
    <li><a className="dropdown-item" href="#">Watch</a></li>


  </ul>
</div>
<div className='col-12 col-md-8  d-flex justify-content-center'>
  <input className='w-75 h-100 py-2 px-4' placeholder='Search..' style={{borderRadius:"20px",border:"none",outline:"none" ,backgroundColor:"rgba(177, 177, 177, 0.42)",fontSize:"18px"}} type='search'/>
</div>
    </div>
   </div>



  
    </>
  );
}
export default SerchItem;