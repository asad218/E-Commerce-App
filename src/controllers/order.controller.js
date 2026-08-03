const OrderModel = require('../models/order.model');
const CartModel = require('../models/cart.model');
const Product = require('../models/product.model');

const createOrder = async (req, res) => {
    const { paymentMethod } = req.body;

    const cart = await CartModel.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            message: "Can't fetch any product, cart is empty"
        });
    }

    let totalAmount = 0;
    let totalProducts = 0;
    let orderItems = [];

    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        totalAmount = totalAmount + product.price * item.quantity;
        totalProducts = totalProducts + item.quantity;
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            priceAtPurchase: product.price
        });
    }

    const newOrder = await OrderModel.create({
        user: req.user.id,
        items: orderItems,
        totalAmount: totalAmount,
        totalProducts: totalProducts,
        paymentMethod: paymentMethod
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
        message: "Order created successfully",
        order: newOrder
    });

};

module.exports = {createOrder};
