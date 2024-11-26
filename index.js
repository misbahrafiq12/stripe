import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/json' }));  

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const endpointSecret = process.env.WEBHOOKS_SECRET;

app.get('/', (req, res) => {
    res.send('Stripe Webhook Test');
});


app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

 
  try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
      console.log('Error verifying webhook signature: ', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      console.log(paymentIntent)
     

   
      return res.status(200).send('Payment successful!');
  }

 
  res.status(200).send('Event received');
});


// app.get('/success', (req, res) => {
//     res.send('Payment Successful');
// });

// app.get('/cancel', (req, res) => {
//     res.send('Payment Cancelled');
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
