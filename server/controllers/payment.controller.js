import Stripe from "stripe";
import Cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.totalPrice;
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "inr",
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { paymentIntentId, shippingAddress } = req.body;

    const existingOrder = await Order.findOne({ paymentIntentId });
    if (existingOrder) {
      return res.status(400).json({ message: "Order already created" });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not confirmed" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount: cart.totalPrice,
      paymentIntentId,
      isPaid: true,
      paidAt: new Date(),
      status: "Processing",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};