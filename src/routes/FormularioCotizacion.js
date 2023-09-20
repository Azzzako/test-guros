import React, { useState } from "react";
import Cotization from "../forms/Cotization";
import ClientData from "../forms/ClientData";




const FormularioCotizacion = () => {

    const [carData, setCarData] = useState({})
    const [cp, setCp] = useState([])
    const [fecha, setFecha] = useState('')
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState('')
    const [part2, setPart2] = useState(false)

    return (
        <>
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
                    setPart2={setPart2}
                />

                {
                    part2 ?
                        <ClientData
                            carData={carData}
                            cp={cp}
                            fecha={fecha}
                            gender={gender}
                            email={email}
                        /> : null
                }

            </div>
        </>
    )
}

export default FormularioCotizacion