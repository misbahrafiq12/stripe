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
