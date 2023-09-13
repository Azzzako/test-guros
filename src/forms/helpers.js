import emailjs from 'emailjs-com'

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

const sendEmail = (email, postData) => {
  const data = {
    to_email: email,
    from_name: 'Oasis Financiero',
    message: `Hola esta es una prueba, increible si funciona 2.0 ${postData}`
  }
  emailjs.send(service, template, data)
}
  export { saveToLocalStorage, deleteFromLocalStorage, sendEmail, emailjs }