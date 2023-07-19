const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const router = express.Router();

router.post("/payment-sheet", async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "eur",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51NVTh4KV4PxCQk433ZwEXKaJyU9civa9bn8f38IFrkgjO5lhcT0BVQE1UDOu6BSGQBwTqVVAy7nuAApqM0d5Tr47000V8TNAQ0",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
