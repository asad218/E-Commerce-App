const CartModel = require('../models/cart.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id; // comes from JWT middleware

        // Check product exists
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({ message: 'Product not found' });

        // Find existing cart or create new one
        let cart = await CartModel.findOne({ user: userId });

        if(!cart) {
            // No cart exists, create fresh cart with this item
            cart = await CartModel.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Cart exists, check if product already in cart
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if(itemIndex > -1) {
                // Product already in cart, just increase quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // New product, push to items array
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET CART
// Why: User opens cart page, needs to see all products with details
// populate() replaces product ObjectId with actual product data
const getCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ user: req.user.id })
            .populate('items.product', 'name price category'); 
            // populate fetches product name, price, category instead of just ID

        if(!cart) return res.status(404).json({ message: 'Cart is empty' });

        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// REMOVE ITEM
// Why: User clicks remove on a specific product
// Logic: Filter out that product from items array
const removeItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await CartModel.findOne({ user: req.user.id });
        if(!cart) return res.status(404).json({ message: 'Cart not found' });

        // Filter out the product to remove
        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// CLEAR CART
// Why: After order is placed, cart should be emptied
const clearCart = async (req, res) => {
    try {
        await CartModel.findOneAndDelete({ user: req.user.id });
        res.status(200).json({ success: true, message: 'Cart cleared' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { addToCart, getCart, removeItem, clearCart };