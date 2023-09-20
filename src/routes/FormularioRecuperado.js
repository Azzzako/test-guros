import React from "react";
import CryptoJS from "crypto-js";

export const FormularioRecuperado = () => {

    const decryptParams = (data, key) => {
       return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
    }

    const searchParams = new URLSearchParams(window.location.search)
    const vehicle = searchParams.get('vehicle')
    const email = searchParams.get('email')
    const emailHashed = decryptParams(email, 'OF-2023!')

    console.log(emailHashed);

    return (
        <>
            <h1>Hola como estas aqui seguria tu cotizacion</h1>
            <h1>{vehicle}</h1>
            
        </>
    )
}