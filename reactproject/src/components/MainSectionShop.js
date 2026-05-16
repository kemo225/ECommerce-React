import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import headphone2 from "../bgproduct.jpg";

function MainSectionShop() {
  return (
    <>
     <div className='container-fluid' style={{height:"200px",backgroundImage:`url(${headphone2})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"}}>
<div style={{height:"200px",position:"absolute",top:"0%",left:"0%",width:"100%",backgroundColor:"rgba(0, 0, 0, 0.73)" }} className=' d-flex justify-content-center align-items-center'>
  <h1 style={{letterSpacing:"2px",fontFamily:"Arial, sans-serif",fontSize:"60px" ,color:"rgb(82, 171, 255)" }} className='fw-bold '>Product</h1>
</div>
     </div>
    </>
  );
}
export default MainSectionShop;