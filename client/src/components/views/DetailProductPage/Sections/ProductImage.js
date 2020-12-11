import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";

function ProductImage(props) {

    const [Images, setImages] = useState([])

    let appURI = null

    if (process.env.NODE_ENV === "production"){
        appURI = process.env.REACT_APP_URL_PRODUCTION
    } else {
        appURI = process.env.REACT_APP_URL_DEVELOPMENT
    }

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0) {
            let images = []

            props.detail.images && props.detail.images.map(item => {
                images.push({
                    original: `data:image/png;base64,${item}`,
                    thumbnail: `data:image/png;base64,${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])

    return (
        <div>
           <ImageGallery items={Images} />
        </div>
    )
}
export default ProductImage;