import { YEAR, SUBRAND, CAR, COTIZATION } from "./types";
import axios from "axios";

const token = process.env.REACT_APP_API_TOKEN

const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
};



export const setSubBrand = (brand) => async (dispatch) => {
    try {
        const response = await axios.get(`https://staging-api.guros.com/catalog/list-sub-brands?description=${brand}`, config);
        dispatch({
            type: SUBRAND,
            payload: response.data
        })

    } catch (error) {
        dispatch({
            type: 'ERROR',
            payload: error
        })
    }
}


export const setYear = (brandId) => async (dispatch) => {
    try {
        const response = await axios.get(`https://staging-api.guros.com/catalog/list-models?subBrandId=${brandId}`, config)
        dispatch({
            type: YEAR,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: 'ERROR',
            payload: error
        })
    }
}

export const setCar = (model) => async (dispatch) => {
    try {
        const response = await axios.get(`https://staging-api.guros.com/catalog/list-versions?modelId=${model}`, config)
        dispatch({
            type: CAR,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: 'ERROR',
            payload: error
        })
    }
}

const fetchQuotationRedux = async (element, carData, cp, fecha, gender) => {

    const configQuotation = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Provider-Code': element,
            'X-Commerce-Code': 'guros',
        },
    }

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
        console.log("Resolviendo promesa para: ", element);
        const response = await axios.post('https://staging-api.guros.com/quotation/quote', postData, configQuotation);
        console.log("Promesa resuelta para: ", element, response.data);
        return response.data
    
}

export const checkPostalCode = (postalCode, carData, fecha, gender) => async (dispatch) => {
    const postData = {
        postalCode: postalCode
    }
    let availableSecure
        const response = await axios.post('https://staging-api.guros.com/catalog/verify-neighborhoods', postData, config);
        const data = response.data;
        if (data?.exist) {
         availableSecure = carData?.supportedInsurers?.filter(element =>
                data?.supportedInsurers?.includes(element))
        }

        if (availableSecure && availableSecure.length > 0) {
            const quotationPromises = await availableSecure.map(element =>
                fetchQuotationRedux(element, carData, postalCode, fecha, gender))
            const quotationResponse = await Promise.allSettled(quotationPromises);
            const quotationWithRejectPromises = quotationResponse.filter(element => element.status === 'fulfilled')
            console.log(quotationWithRejectPromises);
            dispatch({
                type: COTIZATION,
                payload: quotationWithRejectPromises
            })
        }


}
