const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrderModel = require('../models/order.model');
const CartModel = require('../models/cart.model')

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const orderId = session.metadata.orderId;

const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, {
    paymentStatus: 'Paid'
  });

   const cart = await CartModel.findOne({ user: updatedOrder.user });
    cart.items = [];
    await cart.save();
}



  res.status(200).json({ received: true });
});

module.exports = router;
