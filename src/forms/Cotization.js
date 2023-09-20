import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setCar, setSubBrand, setYear } from '../redux/actions';
import { selectCar, selectSubBrand, selectYear } from '../redux/selectors/index';
import { sendEmail } from './helpers';
import Cards from '../cards/Cards';


const Cotization = ({ carData, setCarData, fecha, cp, gender, email, setPart2 }) => {

  const dispatch = useDispatch()
  const data1 = useSelector(selectSubBrand)
  const [loader, setLoader] = useState(false)
  const data2 = useSelector(selectYear)
  const data3 = useSelector(selectCar)
  const [quotationResponses, setQuotationResponses] = useState([])
  const [dataToMail, setDataToMail] = useState({})

  const postData = {
    vehicle: {
      versionId: carData.id,
    },
    policy: {
      package: 'comprehensive',
      paymentFrequency: 'annual',
    },
    client: {
      birthdate: dataToMail?.client?.birthdate,
      gender: dataToMail?.client?.gender,
      address: {
        postalCode: dataToMail?.client?.postalCode,
      },
    },
  };




  const token = process.env.REACT_APP_API_TOKEN

  const fetchData = (e) => {
    e.preventDefault()
    dispatch(setSubBrand(e.target.value))
    setDataToMail({
      ...dataToMail,
      vehicle: {
        brand: e.target.value
      }
    })
  };

  const fetchData2 = (e) => {
    dispatch(setYear(e.target.value))
    setDataToMail({
      ...dataToMail,
      vehicle: {
        ...dataToMail.vehicle,
        brandId: e.target.value,
        subBrand: e.target.options[e.target.selectedIndex].text
      }
    })
  }

  const fetchData3 = (e) => {
    dispatch(setCar(e.target.value))
    setDataToMail({
      ...dataToMail,
      vehicle: {
        ...dataToMail.vehicle,
        year: e.target.options[e.target.selectedIndex].text
      }
    })
  }

  const mailData = (e) => {
    setDataToMail({
      ...dataToMail,
      client: {
        ...dataToMail.client,
        [e.target.name]: e.target.value
      }
    })
  }

  const saveData = (e) => {
    e.preventDefault()
    setCarData(data3.filter(carro => carro.id === e.target.value)[0])
    setDataToMail({
      ...dataToMail,
      carData: {
        ...dataToMail.carData,
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text
      }
    })
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

    console.log("Resolving promise for:", element);
    const response = await axios.post('https://staging-api.guros.com/quotation/quote', postData, config);
    console.log("Promise resolved for:", element, response.data);
    return {
      element: element,
      response: response.data
    };
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

      const postalVerify = {
        postalCode: dataToMail?.client?.postalCode,
      };

      const response = await axios.post('https://staging-api.guros.com/catalog/verify-neighborhoods', postalVerify, config);
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
          setLoader(true)
          const quotationResponse = await Promise.allSettled(quotationPromises);
          const quotationFulfilled = quotationResponse.filter(element => element.status === 'fulfilled')
          setQuotationResponses(quotationFulfilled);
          setLoader(false)
          sendEmail(email, dataToMail)
          setPart2(true)
        }

      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // console.log(carData);
  console.log(dataToMail);

  return (

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
          return <option key={carro.id} value={carro.id} name={carro.id}>{carro.name}</option>
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
        <input name='emailAddress' placeholder='Correo Electronico' onChange={mailData} />
        <label htmlFor='cp'>Codigo Postal: </label>
        <input type='number' id='cp' name='postalCode' onChange={mailData} />
        <label htmlFor='fecha'>Fecha: </label>
        <input type='date' id='fecha' name='birthdate' onChange={mailData} />

        <select onChange={mailData} name='gender'>
          <option value="">Selecciona un genero</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
        <input type='submit' />
      </form>

      {loader ? <h1>Estamos realizando la cotizacion, gracias por esperar</h1> : null}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'space-around' }}>
        {quotationResponses.length > 0 ?
          quotationResponses.map(element => {
            return <Cards
              key={element.value.response.cartId}
              name={element.value.element}
              price={element.value.response.costs}
            />
          })

          :

          null
        }

      </div>

    </div>

  )
}

export default Cotization