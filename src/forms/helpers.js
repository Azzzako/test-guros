import emailjs from 'emailjs-com'
import CryptoJS from 'crypto-js'

const service = process.env.REACT_APP_EMAILJS_SERVICE
const template = process.env.REACT_APP_EMAILJS_TEMPLATE
const key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY


emailjs.init(key)


const saveToLocalStorage = (carData, fecha, gender, cp) => {
  const cotizacion = {
    vehicle: {
      versionId: carData.id,
    },
    policy: {
      package: 'comprehensive',
      paymentFrequency: 'annual',
    },
    client: {
      birthdate: fecha,
      gender: gender,
      address: {
        postalCode: cp,
      },
    },
  };

  localStorage.setItem('cotizacion', JSON.stringify(cotizacion))
}

const deleteFromLocalStorage = () => {
  localStorage.removeItem('cotizacion')
}


const sendEmail = (email, info) => {
  // Clave secreta para el cifrado (reemplaza con tu clave secreta real)
  const secretKey = 'OF-2023!';

  // Función para cifrar los datos sensibles
  function encryptData(data, key) {
    const encrypted = CryptoJS.AES.encrypt(data, key);
    return encrypted.toString();
  }

  

  // Ciframos los datos sensibles
  const encryptedEmail = encryptData(info.client.emailAddress, secretKey);
  const encryptedPostalCode = encryptData(info.client.postalCode, secretKey);
  const encryptedBirthdate = encryptData(info.client.birthdate, secretKey);

  // Construimos los parámetros de la URL cifrando los datos
  const params = `http://localhost:3000/form?vehicle=${encodeURIComponent(info.vehicle.subBrand)}&year=${info.vehicle.year}&email=${encodeURIComponent(encryptedEmail)}&postalCode=${encodeURIComponent(encryptedPostalCode)}&birthdate=${encodeURIComponent(encryptedBirthdate)}`;

  // Construimos el mensaje de correo electrónico con el enlace
  const message = `
  `;

  // Configuramos los datos para el envío del correo electrónico
  const data = {
    to_email: email,
    from_name: 'Oasis Financiero',
    car_subBrand: `${info.vehicle.subBrand}`,
    car_year: `${info.vehicle.year}`,
    client_email: `${info.client.emailAddress}`,
    client_postalCode: `${info.client.postalCode}`,
    client_birthdate: `${info.client.birthdate}`,
    message: message,
    type: 'text/html',
    to_name: 'Azako',
    url: params,
  };

  // Enviamos el correo electrónico
  emailjs.send(service, template, data);
};
  export { saveToLocalStorage, deleteFromLocalStorage, sendEmail, emailjs }