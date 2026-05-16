  import './App.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import React from 'react';
  import { BrowserRouter,Routes,Route } from 'react-router-dom';
  import Cart from './pages/Cart';
  import Shop from './pages/Shop';
  import Home from './pages/Home';
  import Header from './components/Header';
  import Footer from './components/Footer';
  import { useState,createContext } from 'react';

  export const ChartContext = createContext();
  function App() {
  function handleAddToCart(product) {

    chartcards.forEach((item) => {
      if (item.id === product.id) {
        item.quantity += 1;
        setchartcards([...chartcards]);
        localStorage.setItem("chartcards", JSON.stringify(chartcards));
        console.log(chartcards);
      }
    });

    if (!chartcards.find(item => item.id === product.id)) {
      setchartcards([...chartcards, { ...product, quantity: 1 }]);
      localStorage.setItem("chartcards", JSON.stringify([...chartcards, { ...product, quantity: 1 }]));
    }
localStorage.setItem("ChartValue", JSON.stringify(ChartValue + 1));
    setChartValue(ChartValue + 1);
  }

const [ChartValue, setChartValue] = useState(
  localStorage.getItem("ChartValue") == null
    ? 0
    : JSON.parse(localStorage.getItem("ChartValue"))
);

const [chartcards, setchartcards] = useState(
  localStorage.getItem("chartcards") == null
    ? []
    : JSON.parse(localStorage.getItem("chartcards"))
);  

    return (
      <ChartContext.Provider value={{setchartcards, ChartValue, setChartValue, chartcards, handleAddToCart }}>

      <BrowserRouter>
      <Header  />
        <div style={{ paddingTop: "70px" }}>
        </div>
        <Routes>
              <Route  path='/' element={<Home  />} />
          <Route  path='/cart' element={<Cart />}  />
          <Route  path='/shop' element={<Shop />}  />
        </Routes>
        <Footer/>
        </BrowserRouter>
        </ChartContext.Provider>
    );
  }

  export default App;
