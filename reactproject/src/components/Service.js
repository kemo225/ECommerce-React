import { useState } from "react";
import "../App.css";
import { FaCreditCard, FaHeadphones, FaShieldAlt, FaCar } from "react-icons/fa";

function Service() {
  const [services] = useState([
    {
      icon: <FaCreditCard />,
      title: "24/7 Support",
      description: "Stone and Beam Westview",
      bg: "rgba(217, 217, 217, 0.27)",
    },
    {
      icon: <FaHeadphones />,
      title: "24/7 Support",
      description: "Stone and Beam Westview",
      bg: "rgba(11, 49, 0, 0.27)",
    },
    {
      icon: <FaShieldAlt />,
      title: "24/7 Support",
      description: "Stone and Beam Westview",
      bg: "rgba(86, 255, 1, 0.27)",
    },
    {
      icon: <FaCar />,
      title: "24/7 Support",
      description: "Stone and Beam Westview",
      bg: "rgba(0, 104, 139, 0.27)",
    },
  ]);

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center row-cols-md-4 row-cols-sm-1 g-4 py-lg-0 py-5"
        style={{ minHeight: "300px" }}
      >
        {services.map((item, index) => (
          <div className="col-lg-3 col-md-6 col-sm-12 " key={index}>
            <div
              style={{
                height: "150px",
                backgroundColor: item.bg,
              }}
              className="d-flex flex-column justify-content-center align-items-center rounded-4"
            >
              <p className="bg-white circle" style={{ fontSize: "20px" }}>
                {item.icon}
              </p>

              <p className="fw-bold">{item.title}</p>
              <p className="text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;