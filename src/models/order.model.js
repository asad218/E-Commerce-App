const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    
        items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
    
            quantity: {
              type: Number,
              required: true,
              default: 1,
              min: 1,
            },
            priceAtPurchase: {
               type: Number,
               required: true
            }
          },
        ],

        totalAmount :{
            type : Number
        },


         totalProducts :{
            type : Number
        },

       paymentStatus: {
          type: String,
          enum: ["Pending", "Paid", "Failed"],
           default: "Pending"
        },

        orderStatus: {
          type: String,
           enum: [
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled"
            ],
            default: "Pending"
        },

       paymentMethod: {
        type: String,
        enum: ["Stripe", "COD"],
        required: true
      }
    }, 
    {
      timestamps: true
    }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;