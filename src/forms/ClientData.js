import React, { useState } from 'react';

const ClientData = ({carData, fecha, cp, email}) => {

    const [beneficiaryType, setBeneficiaryType] = useState("individual")
    const [checkedBox, setCheckedBox] = useState({ driver: false, beneficiary: false })
  
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
        emailAddress: email,
      },
    })
  
    const handleDriverCheckboxChange = (e) => {
      setCheckedBox({ ...checkedBox, driver: e.target.checked });
    };
  
    const handleCheckboxChange = (e) => {
      setCheckedBox({ ...checkedBox, beneficiary: e.target.checked });
    };
  
    const handleCheckBeneficiaryType = () => {
      if (beneficiaryType === "individual") setBeneficiaryType("company")
      else setBeneficiaryType("company")
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
  
    console.log("Esta es la informacion capturada que se va a mandar a GUROS: ", dataPoliza);
  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 50 }}>
        <h1>Segunda parte de la cotizacion</h1>
        <h3>Recopilamos datos especificos del usuario y del automovil</h3>
        <select onChange={(e) => setDataPoliza({ ...dataPoliza, client: { ...dataPoliza.client, fiscalRegime: e.target.value } })}>
          <option>Selecciona tipo de cliente</option>
          <option value="individual">Soy persona Fisica</option>
          <option value="company">Soy persona Moral</option>
        </select>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>Datos del cliente</h1>
          <input name='firstName' placeholder='Nombre(s)' onChange={handleSaveDataClient} />
          <input name='paternalSurname' placeholder='Apellido Paterno' onChange={handleSaveDataClient} />
          <input name='maternalSurname' placeholder='Apellido Materno' onChange={handleSaveDataClient} />
          <input type='date' value={fecha} disabled />
          <input name='phoneNumber' type='number' placeholder='Numero telefonico' onChange={handleSaveDataClient} />
          {dataPoliza.client.fiscalRegime === 'company' ? <input name='companyName' placeholder='Nombre de la empresa' onChange={handleSaveDataClient} /> : null}
          <input name='tin' placeholder={dataPoliza.client.fiscalRegime === 'company' ? 'RFC de la empresa' : 'RFC de cliente'} onChange={handleSaveDataClient} />
          <h3>Direccion</h3>
          <input placeholder='Calle' name='street' onChange={clientDirection} />
          <input type='number' placeholder='Numero' name='externalNumber' onChange={clientDirection} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 50 }}>
          <h2>Datos del vehiculo especificos porfavor jeje</h2>
          <input name='vin' placeholder='Numero de serie del automovil' onChange={handleSaveDataVehicle} />
          <input name='engineNumber' placeholder='Numero de motor (Pais de origen)' onChange={handleSaveDataVehicle} />
          <input name='licensePlates' placeholder='Numero de Placas' onChange={handleSaveDataVehicle} />
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
            <input name={beneficiaryType === "company" ? "company" : "firstName"} placeholder={beneficiaryType === "company" ? "Nombre de la Compania" : "Nombre(s)"} onChange={handleBeneficiaryData} />
            {beneficiaryType === "individual"

              ?
              <div>
                <input name='paternalSurname' placeholder='Apellido Paterno' onChange={handleBeneficiaryData} />
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

    )
}

export default ClientData