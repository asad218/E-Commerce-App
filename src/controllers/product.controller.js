const ProductModel = require("../models/product.model");
const jwt = require("jsonwebtoken");

const createProduct = async (req,res) =>{
    const {name, description, price, category} = req.body;

    if(!name || !description || !price || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            category    
        });

        return res.status(201).json({
            message:"product created successfully",
            product: newProduct
        });
    } catch(err){
        console.log(err);
        return res.status(400).json({
            message:"error creating new product",
            err
        });
    }
}

const getAllProducts = async (req,res) =>{
  const query = {};
if (req.query.category) {
    query.category = req.query.category;
   
}
if(req.query.price){
    query.price = {
        $lte: req.query.price
    }
}
if(req.query.search){
    query.name = {
    $regex: req.query.search,
    $options: "i"
};
}

const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 5;
const skip = (page - 1) * limit;
const totalProducts = await ProductModel.countDocuments(query);
const totalPages = Math.ceil(totalProducts / limit);

     try{
        const products = await ProductModel.find(query)
        .skip(skip)
        .limit(limit)

        if(!products || products.length === 0) {
            return res.status(404).json({
                message:"no products found"
            });
        }

        return res.status(200).json({
            message:"products fetched successfully",
            currentPage: page,
            limit,
            totalProducts,
            totalPages,
            products
        });
    } catch(err){
        console.log(err);
        return res.status(400).json({
            message:"error fetching products",
            err
        });
    }
} 
   
const getProductById = async (req,res) =>{
    const {id} = req.params;
    try{
        const product = await ProductModel.findById(id);

        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }

        return res.status(200).json({
            message:"product fetched successfully",
            product
        })
    } catch(err){
        console.log(err);
        return res.status(400).json({
            message:"error fetching product", err
        })
    }
}
            
module.exports = {createProduct, getAllProducts, getProductById}