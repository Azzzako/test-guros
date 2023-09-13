import React, { useState } from "react";
import Cotization from "./forms/Cotization";
import ClientData from "./forms/ClientData";


function App() {

  const [carData, setCarData] = useState({})
  const [cp, setCp] = useState([])
  const [fecha, setFecha] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div>
    <Cotization
    carData={carData}
    setCarData={setCarData}
    cp={cp}
    setCp={setCp}
    fecha={fecha}
    setFecha={setFecha}
    gender={gender}
    setGender={setGender}
    email={email}
    setEmail={setEmail}
    />
    <ClientData
    carData={carData}
    cp={cp}
    fecha={fecha}
    gender={gender}
    email={email}
    />
    </div>
  )
}

export default App;

