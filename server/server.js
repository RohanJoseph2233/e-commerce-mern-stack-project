import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js';
import 'dotenv/config'
import User from './models/User.js';
import userRoute from './routes/userRoute.js';
import sellerRoute from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRoute from './routes/productRoutes.js';
import cartRoute from './routes/cartRoute.js';
import addressRoute from './routes/addressRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import razorpayRoute from './routes/razorpayRoute.js';

const port = process.env.PORT ||4000;
const app = express();

await connectDB();
await connectCloudinary();

const allowedOrigins = ['http://localhost:5173','https://e-commerce-mern-stack-project.vercel.app']

app.use(express.json())
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials:true, methods:['GET','POST','PUT','DELETE']  }))

app.get('/', (req,res)=> res.send("API is working"));
app.use('/api/user', userRoute);
app.use('/api/seller', sellerRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/address' , addressRoute)
app.use('/api/order', orderRoute)
app.use('/api/payment', razorpayRoute);

app.listen(port, ()=>{
  console.log(`the app is running on http:/localhost:${port}`);
  
})
