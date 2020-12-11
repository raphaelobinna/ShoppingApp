const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");
const imageToBase64 = require('image-to-base64');

const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file");
 
//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
   
    //after getting image from client
    //saving it inside server

    //multer library
    
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post("/uploadProduct", auth, (req, res) => {

    const { writer, title, description, price, continents, Image } = req.body

    console.log('my image', Image)

    var i;
    let images = []
        for (i = 0; i < Image.length; i++) {
            console.log(Image[i])
            imageToBase64(`${Image[i]}`) // Path to the image
            .then(
                (response) => {
                    //console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
                    images.push(response)
                    console.log(images)

                    if(images.length > 1) {
                        Product.create({
                            writer,
                            title,
                            description,
                            price,
                            continents,
                            images
                        })
                        res.status(200).json({ success: true })
                    }
                }
            )
            .catch(
                (error) => {
                    console.log(error); // Logs an error if there was one
                    res.status(400).json({ success: false, error })
                }
            )
   
        }
       // console.log(timmy)


    //save all data we got from client into the DB
    // const product = new Product(req.body)
    //     product.save((err) => {
    //         if(err) return res.status(400).json({ success: false, err })
    //         return res.status(200).json({ success: true })
    //     })

});

router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if(term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, PostSize: products.length })
            })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, PostSize: products.length })
            })
    }

   

});
// ?id=${productId}&type=single
router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    if( type === "array" ){
        let ids = req.query.id.split(',')
        productIds = []
        productIds = ids.map(item => {
            return item
        })
    }

    //we need to find the product Information that belong to the product Id
    Product.find({'_id': {$in: productIds }})
            .populate('writer')
            .exec( (err, product) => {
                if(err) return req.status(400).send(err)
                return res.status(200).send(product)
            } )
  

});



module.exports = router;
