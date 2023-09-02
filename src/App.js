import React, { useState } from 'react';
import axios from 'axios';
import './App.css'


function App() {
  const [data1, setData1] = useState([]);
  const [checkedBox, setCheckedBox] = useState({ driver: false, beneficiary: false })
  const [data2, setData2] = useState([])
  const [data3, setData3] = useState([])
  const [cp, setCp] = useState([])
  const [fecha, setFecha] = useState('')
  const [gender, setGender] = useState('')
  const [carData, setCarData] = useState({})
  const [beneficiaryType, setBeneficiaryType] = useState("individual")
  

  const token = process.env.REACT_APP_API_TOKEN

  const fetchData = async (e) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`https://staging-api.guros.com/catalog/list-sub-brands?description=${e.target.value.toUpperCase()}`, config);
      setData1(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData2 = async (e) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`https://staging-api.guros.com/catalog/list-models?subBrandId=${e.target.value}`, config)
      setData2(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData3 = async (e) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`https://staging-api.guros.com/catalog/list-versions?modelId=${e.target.value}`, config)
      setData3(response.data)
    } catch (error) {
      console.log(error);
    }
  }



  const saveData = (e) => {
    e.preventDefault()
    setCarData(data3.filter(carro => carro.id === e.target.value)[0])
  }



  const [quotationResponses, setQuotationResponses] = useState([])


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
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  //Funciones segunda parte del formulario 

  const [dataPoliza, setDataPoliza] = useState({
    vehicle: {
      versionId: carData.id,
    },
    policy: {
      package: "comprehensive",
      paymentFrequency: "annual",
    },
    client: {
      
    },
  })

  const handleDriverCheckboxChange = (e) => {
    setCheckedBox({ ...checkedBox, driver: e.target.checked });
  };

  const handleCheckboxChange = (e) => {
    setCheckedBox({ ...checkedBox, beneficiary: e.target.checked });
  };

  const handleCheckBeneficiaryType = () => {
    if (beneficiaryType === "individual") {
      setBeneficiaryType("company")
    } else {
      setBeneficiaryType("individual")
    }
  }

  //Informacion del vehiculo
  const handleSaveDataVehicle = (e) => {
    setDataPoliza({ ...dataPoliza, vehicle: { ...dataPoliza.vehicle, versionId: carData.id, [e.target.name]: e.target.value } })
  }

  //Informacion del cliente
  const handleSaveDataClient = (e) => {
    setDataPoliza({ ...dataPoliza, client: { ...dataPoliza.client, birthdate: fecha, [e.target.name]: e.target.value } })
  }

  const clientDirection = (e) => {
    setDataPoliza({ ...dataPoliza, client: { ...dataPoliza.client, adress: { ...dataPoliza.client.adress, postalCode: cp, [e.target.name]: e.target.value } } })
  }

  //Informacion del conductor habitual

  const handleDataDriver = (e) => {
    setDataPoliza({ ...dataPoliza, driver: { ...dataPoliza.driver, fiscalRegime: 'individual', [e.target.name]: e.target.value } })
  }

  //Informacion del beneficiario preferente

  const handleBeneficiaryData = (e) => {
    setDataPoliza({ ...dataPoliza, preferredBeneficiary: { ...dataPoliza.preferredBeneficiary, fiscalRegime: beneficiaryType, [e.target.name]: e.target.value } })
  }

  console.log("Estos son los seguros con los que puedes asegurar tu auto: ", quotationResponses);
  console.log("Esta es la informacion capturada que se va a mandar a GUROS: " ,dataPoliza);


  return (
    <div>
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
          <option value="">Selecciona una modelo</option>
          {data1.map(carro => {
            return <option key={carro.id} value={carro.id}>{carro.name}</option>
          })}
        </select>

        <select onChange={fetchData3}>
          <option value="">Año de tu automovil</option>
          {data2.map(carro => {
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
          <label htmlFor='cp'>Codigo Postal: </label>
          <input type='number' id='cp' onChange={(e) => setCp(e.target.value)} />
          <label htmlFor='fecha'>Fecha: </label>
          <input type='date' id='fecha' onChange={(e) => setFecha(e.target.value)} />

          <select onChange={(e) => setGender(e.target.value)}>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          <input type='submit' />
        </form>



      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 50 }}>
        <h1>Segunda parte de la cotizacion</h1>
        <h3>Recopilamos datos especificos del usuario y del automovil</h3>
        <select onChange={(e) => setDataPoliza({ ...dataPoliza, client: { ...dataPoliza.client, fiscalRegime: e.target.value } })}>
          <option>Selecciona tipo de cliente</option>
          <option value="individual">Soy persona Fisica</option>
          <option value="company">Soy persona Moral</option>
        </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 50 }}>
            <h2>Datos del vehiculo especificos</h2>
            <input name='vin' placeholder='Numero de serie del automovil' onChange={handleSaveDataVehicle}/>
            <input name='engineNumber' placeholder='Numero de motor (Pais de origen)' onChange={handleSaveDataVehicle}/>
            <input name='licensePlates' placeholder='Numero de Placas' onChange={handleSaveDataVehicle}/>
          </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>Datos del cliente</h1>
          <input name='firstName' placeholder='Nombre(s)' onChange={handleSaveDataClient} />
          <input name='paternalSurname' placeholder='Apellido Paterno' onChange={handleSaveDataClient} />
          <input name='maternalSurname' placeholder='Apellido Materno' onChange={handleSaveDataClient} />
          <input type='date' value={fecha} disabled />
          <input name='phoneNumber' type='number' placeholder='Numero telefonico' onChange={handleSaveDataClient} />
          <input name='emailAdress' placeholder='Correo Electronico' onChange={handleSaveDataClient} />
          {dataPoliza.client.fiscalRegime === 'company' ? <input name='companyName' placeholder='Nombre de la empresa' onChange={handleSaveDataClient} /> : null}
          <input name='tin' placeholder={dataPoliza.client.fiscalRegime === 'company' ? 'RFC de la empresa' : 'RFC de cliente'} onChange={handleSaveDataClient} />
          <h3>Direccion</h3>
          <input placeholder='Calle' name='street' onChange={clientDirection} />
          <input type='number' placeholder='Numero' name='externalNumber' onChange={clientDirection} />
        </div>


        <label>
          <input
            checked={checkedBox.driver}
            type='checkbox'
            onChange={handleDriverCheckboxChange}
          />
          No soy el conductor habitual
        </label>

        {checkedBox.driver

          ?

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Datos del conductor habitual</h1>
            <input placeholder='Nombre(s) del conductor' name='firstName' onChange={handleDataDriver} />
            <input placeholder='Apellido Paterno' name='paternalSurname' onChange={handleDataDriver} />
            <input placeholder='Apellido Materno' name='maternalSurname' onChange={handleDataDriver} />
            <label>
              Fecha de Nacimiento
              <input type='date' name='birthdate' onChange={handleDataDriver} />
            </label>
            <input placeholder='RFC' name='tin' onChange={handleDataDriver} />
            <select name='gender' onChange={handleDataDriver}>
              <option value="">Genero</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          :

          null

        }

        <label>
          <input
            checked={checkedBox.beneficiary}
            type='checkbox'
            onChange={handleCheckboxChange}
          />
          Tengo un beneficiario Preferente
        </label>

        {checkedBox.beneficiary

          ?

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Datos del beneficiario preferente</h1>

            <label>
              <input
                checked={beneficiaryType === "company" ? true : false}
                type='checkbox'
                onChange={handleCheckBeneficiaryType}
              />
              Beneficiario Moral
            </label>
            <input name={beneficiaryType === "company" ? "company" : "firstName"} placeholder={beneficiaryType === "company" ? "Nombre de la Compania" : "Nombre(s)"} onChange={handleBeneficiaryData}/>
            {beneficiaryType === "individual"

              ?
              <div>
                <input name='paternalSurname' placeholder='Apellido Paterno' onChange={handleBeneficiaryData}/>
                <input name='maternalSurname' placeholder='Apellido Materno' onChange={handleBeneficiaryData} />
              </div>

              :

              null}
            <label>
              Fecha de Nacimiento
              <input name='birthdate' type='date' onChange={handleBeneficiaryData} />
            </label>
            <input name='tin' placeholder={beneficiaryType === "company" ? "Razon Social" : 'RFC'} onChange={handleBeneficiaryData} />
            {beneficiaryType === "individual" ?
              <select name='gender' onChange={handleBeneficiaryData}>
                <option value="">Genero</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
              :
              null
            }
          </div>

          :

          null

        }




      </div>

    </div>

  );
}

export default App;

