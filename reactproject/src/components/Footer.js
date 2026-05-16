import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart } from 'react-icons/fa';

function Footer() {
  return (
    
     <>
     <footer style={{minHeight:"400px",marginTop:"auto"}} className="bg-dark container-fluid d-flex justify-content-center align-items-center py-md-0 py-5" >
        <div className='container'>
      <div className='row'>
<div style={{height:"250px",backgroundColor:""}}  className='col-md-3 col-10 d-flex flex-column align-items-md-center align-items-start justify-content-between'>
    <ul  className= 'h-100 list-nav-none text-light d-flex flex-column align-items-start p-0 p-md-0 justify-content-around'>
             <li><h1 className='text-light'><FaShoppingCart /> Store</h1></li>
              <li className='opacity-25'>Lorem ipsum dolor sit amet,
                 consectetur adipiscing elitAuctor libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.</li>
                <li className='opacity-25'></li><li className='opacity-25'></li>
                 <li className='opacity-25'></li>

    </ul>
</div>
<div style={{height:"250px",backgroundColor:""}}  className='col-md-3 col-10 d-flex flex-column align-items-md-center align-items-start justify-content-between'>
    <ul  className='p-0 p-md-0 h-100 list-nav-none text-light d-flex flex-column align-items-start justify-content-around'>
               <li ><h2>Contact Us</h2></li>
                <li className='opacity-25'>Follow Us</li>
        <li className='opacity-25'>Facebook</li>
                <li className='opacity-25'>Our Cares</li>
        <li className='opacity-25'>Terms & Conditions</li>
        <li className='opacity-25'>Privacy Policy</li>

    </ul>
</div>
<div style={{height:"250px",backgroundColor:""}}  className='col-md-3 col-10 d-flex flex-column align-items-md-center align-items-start justify-content-between'>
    <ul  className='p-0 p-md-0 h-100 list-nav-none text-light d-flex flex-column align-items-start justify-content-around'>
               <li ><h2>Follow Us</h2></li>
                <li className='opacity-25'>Careers</li>
        <li className='opacity-25'>Facebook</li>
                <li className='opacity-25'>Our Cares</li>
        <li className='opacity-25'>Terms & Conditions</li>
        <li className='opacity-25'>Privacy Policy</li>

    </ul>
</div>
<div style={{height:"250px",backgroundColor:""}}  className='col-md-3 col-10 d-flex flex-column align-items-md-center align-items-start justify-content-between'>
    <ul  className='p-0 p-md-0 h-100 list-nav-none text-light d-flex flex-column align-items-start justify-content-around'>
               <li ><h2>About</h2></li>
                <li className='opacity-25'>Contact Us</li>
        <li className='opacity-25'>Facebook</li>
                <li className='opacity-25'>Our Cares</li>
        <li className='opacity-25'>Terms & Conditions</li>
        <li className='opacity-25'>Privacy Policy</li>

    </ul>
</div>
      </div>
      </div>
      </footer>
     </>
  );
}

export default Footer;
