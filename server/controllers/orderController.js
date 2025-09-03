import Product from "../models/Product.js";
import Order from "../models/Order.js";

  //place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const {items, address,userId} = req.body;
    
    

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += (product.offerPrice || 0) * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax/extra

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




// get order by id /api/order/user

export const getUserOrders = async(req,res)=>{
    try {
        const userId = req.user.id;
        const orders = await Order.find({userId,
            $or:[{paymentType:"COD"}, {isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})
        res.json({success:true, orders})
    } catch (error) {
         res.json ({success:false, message:error.message})
    }
}



export const getAllOrders = async(req,res)=>{
     try {
        
        const orders = await Order.find({
            $or:[{paymentType:"COD"}, {isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})
        res.json({success:true, orders})
    } catch (error) {
         res.json ({success:false, message:error.message})
    }
}


