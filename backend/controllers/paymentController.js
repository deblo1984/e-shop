const asyncHandler = require('express-async-handler');

const stripe = require('stripe')('sk_test_51IaxoQDQGBkLohA7PoB5a0sH114SbKuVJFMHJvUnKsHcvR2O6WynbvSbjRjjyj0qbpYJRj9ttckKl8Mq5bKddveZ001mfr4q9l');

//console.log('KEY', 'STRIPE_SECRET_KEY')

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