import React from 'react';
import { Carousel } from 'antd';

function ImageSlider(props) {

    let appURI = null

    if (process.env.NODE_ENV === "production"){
        appURI = process.env.REACT_APP_URL_PRODUCTION
    } else {
        appURI = process.env.REACT_APP_URL_DEVELOPMENT
    }


    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div  key={index}>
                        <img style={{ width:'100%', height:'150px' }}  src={`${appURI}/${image}`} alt="productImage" />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}
export default ImageSlider