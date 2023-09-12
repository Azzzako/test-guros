import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setCar, setSubBrand, setYear } from '../redux/actions';
import { selectCar, selectSubBrand, selectYear } from '../redux/selectors/index';
import {sendEmail, saveToLocalStorage} from './helpers';


const Cotization = ({carData, setCarData, fecha, setFecha, cp, setCp, gender, setGender, email, setEmail}) => {

const dispatch = useDispatch()
const data1 = useSelector(selectSubBrand)
const data2 = useSelector(selectYear)
const data3 = useSelector(selectCar) 
const [quotationResponses, setQuotationResponses] = useState([])


const token = process.env.REACT_APP_API_TOKEN
const domain = process.env.REACT_APP_MAILGUN_DOMAIN
const emailgun = process.env.REACT_APP_MAILGUN_EMAIL
const key = process.env.REACT_APP_MAILGUN_KEY
console.log(domain,emailgun, key);

  const fetchData = (e) => {
    e.preventDefault()
    dispatch(setSubBrand(e.target.value))
  };

  const fetchData2 = (e) => {
    dispatch(setYear(e.target.value))
  }

  const fetchData3 = (e) => {
    dispatch(setCar(e.target.value))
  }

  const saveData = (e) => {
    e.preventDefault()
    setCarData(data3.filter(carro => carro.id === e.target.value)[0])
  }

  const fetchQuotations = async (element, carData, token, cp, fecha, gender) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Provider-Code': element,
        'X-Commerce-Code': 'guros',
      },
    };

    const postData = {
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

    console.log('antes de cotizar', postData)

    console.log("Resolving promise for:", element);
    const response = await axios.post('https://staging-api.guros.com/quotation/quote', postData, config);
    console.log("Promise resolved for:", element, response.data);
    return response.data;
  };


  const fetchData4 = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const postData = {
        postalCode: cp,
      };

      const response = await axios.post('https://staging-api.guros.com/catalog/verify-neighborhoods', postData, config);
      const data4 = response.data;

      if (data4.exists) {
        const availableSecure = carData?.supportedInsurers?.filter(element =>
          data4?.supportedInsurers?.includes(element)
        );

        console.log("Los seguros disponibles para este auto segun tu CP son: ", availableSecure);

        if (availableSecure && availableSecure.length > 0) {
          const quotationPromises = await availableSecure.map(element =>
            fetchQuotations(element, carData, token, cp, fecha, gender)
          );
          const quotationResponse = await Promise.allSettled(quotationPromises);
          const quotationWithRejectPromises = quotationResponse.filter(element => element.status === 'fulfilled')
          setQuotationResponses(quotationWithRejectPromises);
          saveToLocalStorage(carData, fecha, gender, cp)
          await sendEmail(email)
        }

      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  console.log("Estos son los seguros con los que puedes asegurar tu auto: ", quotationResponses);

return(
    
    <div className="App" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 50 }}>
      <h1>Primera Parte de la cotizacion</h1>
      <h3>Recopilamos los datos del automovil y del interesado</h3>
      <select name='model' id='model' onChange={fetchData}>
        <option value="">Selecciona una marca</option>
        <option value="audi">Audi</option>
        <option value="kia">KIA</option>
        <option value="ferrari">Ferrari</option>
      </select>

      <select onChange={fetchData2}>
        <option value="">Selecciona un modelo</option>
        {data1?.map(carro => {
          return <option key={carro.id} value={carro.id}>{carro.name}</option>
        })}
      </select>

      <select onChange={fetchData3}>
        <option value="">Año de tu automovil</option>
        {data2?.map(carro => {
          return <option key={carro.id} value={carro.id}>{carro.name}</option>
        })}
      </select>

      <select onChange={saveData}>
        <option value="">Tu automovil es:</option>
        {data3.map((carro) => {
          return <option key={carro.id} value={carro.id}>{carro.description}</option>
        })}
      </select>


      <form style={{ display: 'flex', flexDirection: 'column', padding: 50 }} onSubmit={fetchData4}>
        <label htmlFor='emailAdress'>Email</label>
      <input name='emailAdress' placeholder='Correo Electronico' onChange={(e) => setEmail(e.target.value)}/>
        <label htmlFor='cp'>Codigo Postal: </label>
        <input type='number' id='cp' onChange={(e) => setCp(e.target.value)} />
        <label htmlFor='fecha'>Fecha: </label>
        <input type='date' id='fecha' onChange={(e) => setFecha(e.target.value)} />

        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">Selecciona un genero</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
        <input type='submit' />
      </form>



    </div>

    )
}

export default Cotization