import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data1, setData1] = useState([]);
  const [value, setValue] = useState("")
  const [data2, setData2] = useState([])
  const [data3, setData3] = useState([])
  const [data4, setData4] = useState([])
  const [data5, setData5] = useState([])
  const [cp, setCp] = useState([])
  const [fecha, setFecha] = useState('')
  const [gender, setGender] = useState('')
  const [dataAseg, setDataAseg] = useState([])

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21tZXJjZUNvZGUiOiJvYXNpcy1maW5hbmNpZXJvIiwicGFydG5lckNvZGUiOiJvYXNpcy1maW5hbmNpZXJvIiwicmVxdWVzdGVyUm9sZSI6ImFwaSIsImlhdCI6MTY4NzM2MDkxMCwiZXhwIjoyMDAyOTM2OTEwLCJpc3MiOiJHdXJvcyJ9.yBtNf_gQG8QiIWj-8QgJrPm2PnKu_VxBqt_g6yjuaXM';

  const fetchData = async (e) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      setValue(e.target.value);
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


  const [carData, setCarData] = useState({})

  const saveData = (e) => {
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

  console.log(quotationResponses);


  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <select name='model' id='model' onChange={fetchData}>
        <option value=""></option>
        <option value="audi">Audi</option>
        <option value="kia">KIA</option>
        <option value="ferrari">Ferrari</option>
      </select>

      <select onChange={fetchData2}>
        {data1.map(carro => {
          return <option key={carro.id} value={carro.id}>{carro.name}</option>
        })}
      </select>

      <select onChange={fetchData3}>
        {data2.map(carro => {
          return <option key={carro.id} value={carro.id}>{carro.name}</option>
        })}
      </select>

      <select onChange={saveData}>
        {data3.map((carro, index) => {
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
  );
}

export default App;

