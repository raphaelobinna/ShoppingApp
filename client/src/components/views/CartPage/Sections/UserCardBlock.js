import React from 'react';
let appURI = null

if (process.env.NODE_ENV === "production"){
    appURI = process.env.REACT_APP_URL_PRODUCTION
} else {
    appURI = process.env.REACT_APP_URL_DEVELOPMENT
}

function UserCardBlock(props) {

    const renderCartImage = (images) => {
        if(images.length > 0){
            let image = images[0]
            return `data:image/png;base64,${image}`
        }
    }  


    const renderItems = () => (         
        props.products && props.products.map(product => (
            <tr key={product._id} >
                <td>
                    <img style={{ width: '70px' }} alt="product" src={renderCartImage(product.images)} />
                </td>
                <td> {product.quantity} EA</td>
                <td> ${product.price} </td>
                <td> <button 
                    onClick={() => props.removeItem(product._id)}
                    > Remove </button> </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove From Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>

        </div>
    )
}
export default UserCardBlock;