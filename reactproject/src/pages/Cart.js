import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { ChartContext } from "../App";

function Cart() {

  const { chartcards, setchartcards, setChartValue, ChartValue } = useContext(ChartContext);

  // ADD QUANTITY
  const increaseQty = (id) => {
    const updated = chartcards.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setchartcards(updated);
    setChartValue(prev => prev + 1);
    localStorage.setItem("ChartValue", JSON.stringify(ChartValue + 1));
    localStorage.setItem("chartcards", JSON.stringify(updated));
  };

  // REMOVE QUANTITY OR DELETE ITEM
  const decreaseQty = (id) => {
    const updated = chartcards
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    setchartcards(updated);
    setChartValue(prev => prev - 1);
    localStorage.setItem("ChartValue", JSON.stringify(ChartValue - 1));
    localStorage.setItem("chartcards", JSON.stringify(updated));
  };

  // TOTAL PRICE
  const totalPrice = chartcards.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  return (
    <div className='container py-4 py-md-5'>

      <div className='row justify-content-center g-4'>

        {/* LEFT SIDE */}
        <div className='col-12 col-lg-8'>

          <div
            className='p-3 p-md-4 rounded-4 shadow-soft'
            style={{ backgroundColor: "var(--color-white)" }}
          >

            <h2
              className='fw-bold mb-4 text-center text-md-start'
              style={{ color: 'var(--color-slate-900)' }}
            >
              Your Cart
            </h2>

            {chartcards.length === 0 ? (

              <div className='text-center py-5'>
                <h4 style={{ color: 'var(--color-slate-500)' }}>
                  Cart Is Empty
                </h4>
              </div>

            ) : (

              chartcards.map(item => (

                <div
                  key={item.id}
                  className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 p-3 rounded-4 mb-3 shadow-sm'
                  style={{
                    backgroundColor: "var(--color-light-gray)",
                    border: '1px solid #e2e8f0'
                  }}
                >

                  {/* LEFT CONTENT */}
                  <div className='d-flex flex-column flex-sm-row align-items-center gap-3 w-100'>

                    <img
                      src={item.img}
                      alt={item.title}
                      className='img-fluid'
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "2px solid var(--color-sky-100)"
                      }}
                    />

                    <div className='text-center text-sm-start'>

                      <h5
                        className='fw-bold mb-2'
                        style={{ color: 'var(--color-slate-900)' }}
                      >
                        {item.title}
                      </h5>

                      <p
                        className='mb-1 fw-bold'
                        style={{ color: 'var(--color-sky-500)' }}
                      >
                        Price: ${item.price}
                      </p>

                      <p
                        className='mb-0 fw-semibold'
                        style={{ color: 'var(--color-slate-500)' }}
                      >
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>

                    </div>

                  </div>

                  {/* RIGHT CONTROLS (RESPONSIVE) */}
                  <div className="d-flex align-items-center justify-content-center gap-2 mt-2 mt-md-0">

                    {/* MINUS */}
                    <button
                      className="btn rounded-circle fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "clamp(32px, 8vw, 42px)",
                        height: "clamp(32px, 8vw, 42px)",
                        backgroundColor: "var(--color-white)",
                        color: "var(--color-slate-800)",
                        border: "1px solid #e2e8f0",
                        fontSize: "clamp(14px, 3vw, 18px)",
                      }}
                      onClick={() => decreaseQty(item.id)}
                    >
                      −
                    </button>

                    {/* QUANTITY */}
                    <span
                      className="fw-bold text-center"
                      style={{
                        minWidth: "28px",
                        fontSize: "clamp(14px, 3.5vw, 18px)",
                        color: "var(--color-slate-900)"
                      }}
                    >
                      {item.quantity}
                    </span>

                    {/* PLUS */}
                    <button
                      className="btn rounded-circle fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      style={{
                        width: "clamp(32px, 8vw, 42px)",
                        height: "clamp(32px, 8vw, 42px)",
                        backgroundColor: "var(--color-sky-500)",
                        color: "var(--color-white)",
                        border: "none",
                        fontSize: "clamp(14px, 3vw, 18px)",
                      }}
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className='col-12 col-lg-4'>

          <div
            className='card border-0 shadow-soft rounded-4 overflow-hidden'
            style={{ backgroundColor: "var(--color-white)" }}
          >

            <div
              className='card-header border-0 text-white fw-bold fs-5 py-3 text-center'
              style={{ backgroundColor: "var(--color-sky-500)" }}
            >
              Cart Summary
            </div>

            <div className='card-body p-4 text-center'>

              <h6
                className='fw-semibold mb-2'
                style={{ color: 'var(--color-slate-500)' }}
              >
                Total Price
              </h6>

              <h2
                className='fw-bold mb-4'
                style={{ color: 'var(--color-slate-900)' }}
              >
                ${totalPrice.toFixed(2)}
              </h2>

              <button
                className='btn w-100 mt-2 text-white fw-bold py-2 shadow-hover'
                style={{
                  backgroundColor: "var(--color-slate-900)",
                  borderRadius: "12px"
                }}
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;