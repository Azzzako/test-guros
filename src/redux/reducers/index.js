import { CAR, COTIZATION, SUBRAND, YEAR } from "../actions/types";

const initialState = {
    subBrand: [],
    year: [],
    car: [],
    cotization: []
}


const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case SUBRAND:
            return {
                ...state,
                subBrand: action.payload
            }

        case YEAR:
            return {
                ...state,
                year: action.payload
            }

        case CAR:
            return {
                ...state,
                car: action.payload
            }
        
        case COTIZATION:
            return {
                ...state,
                cotization: action.payload
            }
        default:
            return state;
    }
}

export default rootReducer