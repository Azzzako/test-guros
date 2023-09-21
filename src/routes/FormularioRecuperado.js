import React from "react";
import CryptoJS from "crypto-js";
import ClientData from "../forms/ClientData";

export const FormularioRecuperado = () => {

    const decryptParams = (data, key) => {
       return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
    }

    const searchParams = new URLSearchParams(window.location.search)
    const vehicle = searchParams.get('vehicle')
    const email = searchParams.get('email')
    const postalCode = searchParams.get('postalCode')
    const brandId = searchParams.get('brand')
    const birthdate = searchParams.get('brt')
    const brandIdDecrypt = decryptParams(brandId, 'OF-2023!')
    const postalCodeDecrypt = decryptParams(postalCode, 'OF-2023!')
    const emailHashed = decryptParams(email, 'OF-2023!')

    console.log( brandIdDecrypt, birthdate);

    return (
        <>
            <h1>Hola como estas aqui seguria tu cotizacion</h1>
            <h1>{vehicle}</h1>
            <h2>{emailHashed}</h2>
            <ClientData
            carData={brandIdDecrypt}
            fecha={birthdate}
            cp={postalCodeDecrypt}
            email={emailHashed}
            />
        </>
    )
}