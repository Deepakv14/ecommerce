const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');

// Create a Product -- Admin
exports.createProduct = async(req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}


// Get All Products
exports.getAllProducts = async(req, res) => {
    const resultsPerPage = 5; // For Pagination 
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultsPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products
    })
}

// Update Product -- Admin

exports.updateProduct = async(req, res) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not Found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
}

// Delete Product -- Admin

exports.deleteProduct = async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not Found"
        })
    }
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })

}