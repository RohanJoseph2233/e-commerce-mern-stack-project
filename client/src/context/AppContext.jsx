import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials =true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;




export const AppContext = createContext();

export const AppContextProvider  = ({children})=>{
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery,setSearchQuery] = useState({})

    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            
            
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
            
            
        } catch (error) {
            setIsSeller(false);
        }
    }

    const fetchUser = async()=>{
        try{
            const {data} = await axios.get('api/user/is-auth');
            if(data.success){
                setUser(data.user);
                
                setCartItems(data.user.cartItems);
            }
          
        }  catch(error){
                setUser(null);
            }
    }

    useEffect(()=>{
        user: console.log(user);
        cartItems : console.log(cartItems);
        
        
    },[user])







   

    const loadUpData = async()=>{
       try{
        const {data} = await axios.get('/api/product/list')
        console.log();
        
        if(data.success){
        
            
            setProducts(data.products)
        }else{
            toast.error(data.message);
        }
     }catch(error){
            toast.error(error.message);
        }
       }
    

    
    useEffect(() => {
    async function initialize() {
      await fetchUser();
      await fetchSeller();
      await loadUpData();
    }
    initialize();
  }, []);


    useEffect(()=>{
        const updateCart = async()=>{
            try {
                const {data} = await axios.post('/api/cart/update',{cartItems});
                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(data.message);
            }
        }

        if(user){
            updateCart();
        }
    },[cartItems])


 
    
        

    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems)

        if(cartData[itemId]){
            cartData[itemId] +=1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart")
    }

    const updateToCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("cart updated")         
    }

    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -=1;
            if(cartData[itemId]=== 0){
                delete cartData[itemId];
            }
            setCartItems(cartData);
        }
             
        toast.success("items deleted successfully")
    }


         const getCartCount=()=>{
            let totalCount = 0;
            for(const item in cartItems){
                totalCount +=cartItems[item];
            }
            return totalCount;
        }

          const getCartAmount = ()=>{
            let totalAmount =0;
            for(const items in cartItems){
                let itemInfo = products.find((product)=>product._id === items)
                if(cartItems[items] >0){
                    totalAmount+= itemInfo.offerPrice * cartItems[items]
                }
            }
            return Math.floor(totalAmount*100)/100;
        }


   
 
     
        
   
    const value = {navigate ,products, user, setUser, isSeller, setIsSeller,showUserLogin,setShowUserLogin, 
        currency,addToCart,axios,updateToCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery, getCartAmount, getCartCount,loadUpData, setCartItems}
    return <AppContext.Provider value = {value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return  useContext(AppContext)
}