import express from 'express'
import dotenv from 'dotenv'
import Stripe from 'stripe'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

   
    
    app.post('/create-payment-link',async (req,res)=>{
     try{
         // create product
        const {products} = req.body
    
        if(!products) return res.status(400).json({message:"product is required"});
        
        const line_items =  products.map((product)=>{
            return{
                price: product.price ,
                quantity: product.quantity

            }
            })
            // create payement link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: line_items
        })
        console.log("Line Items: ", line_items);

        res.status(201).json({message:"product create",url:paymentLink.url})
    }catch (error) {
        res.status(500).json({ error: error.message }); 
    }
        })
         
        
        
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})


// app.post('/create-chectout-session',async (req,res)=>{
//     try{
// const session = await stripe.checkout.sessions.create({
//     line_items:[
//         {
//            price_data:{
//                currency:'usd',
//                product_data:{
//                    name:"Laptop"
//                },
//                unit_amount: 50 * 100
//            },
//            quantity:2
//         },
//         {
//             price_data:{
//                 currency:'usd',
//                 product_data:{
//                     name:"T-Shirt"
//                 },
//                 unit_amount: 20 * 100
//             },
//             quantity:2
//          }
//       ],
//      mode:'payment',

//      shipping_address_collection:{
//    allowed_countries:['US','BR']
//      },
//       success_url:'http://localhost:3000/success',
//       cancel_url:'http://localhost:3000/cancel'
   
// })
// console.log(session)
// res.redirect(session.url)
   
//     }catch (error) {
//         res.status(500).json({ error: error.message }); 
//     }
// })



// successPage

// app.post('/create-checkout-session', async (req, res) => {
//     try {
//         const { products } = req.body;

//         if (!products) {
//             return res.status(400).json({ error: "Products required." });
//         }

//         const line_items = products.map((product) => {
//             if (!product.name  || !product.quantity ) {
//                 throw new Error("All fields are required: name, price, quantity")
//             }

//             return {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: product.name,
//                         // images: [product.image],
//                     },
//                     unit_amount: product.price * 100, 
//                 },
//                 quantity: product.quantity,
//             };
//         });

//         const session = await stripe.checkout.sessions.create({
//             line_items,
//             mode: 'payment',
//             // shipping_address_collection: {
//             //     allowed_countries: ['US', 'BR'],
//             // },
//             success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}', 
//             cancel_url: 'http://localhost:3000/cancel', 
//         });

//         console.log("Session created:", session);
//         res.status(201).json({ message: "Checkout session created", url: session.url });
//     } catch (error) {
//         console.error("Server Error:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });
