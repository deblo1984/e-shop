const asyncHandler = require('express-async-handler');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.processPayment = asyncHandler(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',

        metadata: { integration_check: 'accept_a_payment' }
    });
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})

exports.sendStripeApi = asyncHandler(async (req, res) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})