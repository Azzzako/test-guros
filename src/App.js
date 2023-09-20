import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import FormularioCotizacion from "./routes/FormularioCotizacion";
import './App.css'
import { FormularioRecuperado } from "./routes/FormularioRecuperado";

function App() {



  return (
    <Router>
      <Routes>
        <Route path="/" exact Component={FormularioCotizacion} />
        <Route path="/form" Component={FormularioRecuperado} />
      </Routes>
    </Router>
  )
}

export default App;

