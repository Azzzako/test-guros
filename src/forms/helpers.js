import SMTPClient from 'smtp'

const sendEmail = async (email) => {

const domain = process.env.REACT_APP_MAILGUN_DOMAIN
const emailgun = process.env.REACT_APP_MAILGUN_EMAIL
const key = process.env.REACT_APP_MAILGUN_KEY
const client = new SMTPClient({
    user: 'tu_usuario',
    pass: 'tu_contraseña',
    host: 'tu_servidor_smtp',
    ssl: true,
  });

  const emailToSend = {
    from: 'tu_correo@dominio.com',
    to: `${email}`,
    subject: 'Asunto del Correo',
    body: 'Contenido del correo electrónico',
  };

  client.send(emailToSend, (result) => {
    if (result.status === 'success') {
      alert('Correo electrónico enviado con éxito.');
    } else {
      alert('Hubo un problema al enviar el correo electrónico.');
    }
  });
  };


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

  export {sendEmail, saveToLocalStorage}