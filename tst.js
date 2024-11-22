const express = require('express');
const stripe = require('stripe')('sk_test_51QNia6Bhrh879nixeuBVDuPnuLU2UqU4CIv2RGvBE5HCIWMSSQtwOE87mLGvIlJm9Xh9KzK0SrNzynVmHu5qop9D00wW9Z7d34'); // Apni Stripe Secret Key yahan lagayen
const app = express();

app.use(express.json()); // JSON body ko parse karne ke liye middleware

app.post('/create-payment-link', async (req, res) => {
    try {
        const { products } = req.body;

        // Agar products array missing ya empty hai to error throw karein
        if (!products || products.length === 0) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        // Price IDs aur quantities ko line_items format me map karein
        const lineItems = products.map(product => ({
            price: product.price, // Stripe Price ID
            quantity: product.quantity,
        }));

        // Payment Link create karein
        const paymentLink = await stripe.paymentLinks.create({
            line_items: lineItems,
        });

        res.status(200).json({ url: paymentLink.url }); // Payment link return karein
    } catch (error) {
        res.status(500).json({ error: error.message }); // Error response handle karein
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

