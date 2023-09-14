import React from 'react'

const Cards = ({name, price}) => {

    console.log(price);
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <h1>{name}</h1>
        <span>Precio neto: ${price.price}</span>
        <span>Precio con descuento: ${price.netPremium}</span>
        <span>Descuento: {price.discount}%</span>
        </div>
    )
}

export default Cards