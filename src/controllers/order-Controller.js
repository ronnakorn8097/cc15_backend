const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.createOrder = async (req, res, next) => {
  try {

    
    const order = req.body;
    
    // amount กับ menuId
    const orderMenus = req.body.orderMenus

    // map หาค่า amount กับ menuId
    const toCreateOrderMenus = orderMenus.map((e)=>{
      return {
        menuId : e.menuId, 
        amounts: e.amounts
      }
    })

  

    // return object ของ menuId ที่ client ส่งมา 1 orders > 1 menuIds
    const menuIds = orderMenus.map((e)=>{
     return e.menuId
    });



    // menuIds นำมา check กับ menus table ว่ามีค่าไหม
    const menus = await prisma.menus.findMany({
      where : {
        id : {
          in : menuIds
        }
      }
    });
  

  let totalPrice = 0;
   menus.map((el)=>{
     
      const targetMenu = orderMenus.find(menu=>menu.menuId === el.id);
     const sumMenuPrice = el.price * targetMenu.amounts
     totalPrice += sumMenuPrice 
    })

    // ถ้ามี discount
    // vat 7%
   let afterPriceDiscount = totalPrice*(order.discount/100);
   totalPrice -= afterPriceDiscount;
   totalPrice += totalPrice*0.07

  //  console.log(afterPriceDiscount)
  //  console.log(totalPrice)

   // menus.length = 0 mean no data in database
    if(menus.length == 0)
    {
      return next(createError('menuId not found in database',400))
    }

    // เอาค่า menuIds ที่ได้ ไป check ว่าราคาเท่าไรห่

    // หา user
    const user = await prisma.users.findUnique({
      where : {
        id : req.user.id
      }
    });

    // ถ้า user ไม่มี ค่า
    if(!user)
    {
      return next(createError('user not found',400))
    }

  delete user.password

    const createOrder = await prisma.orders.create({
      data : {
        userId : user.id,
        totalPrice : totalPrice.toFixed(2).toString(),
        discount : order?.discount,
        orderMenus : {
          create : toCreateOrderMenus
        }
      }
    })
    

    res.status(200).json({user,createOrder})

   
  } catch (error) {
    next(error);
  }
};













   //นำค่าที่ได้จาก menus check id ว่าตรงกับ menuIds ไหม
    // const notFoundMenus = menuIds.filter(
    //   menuId=> !menus.some(
    //     menu=> menu.id === menuId

    // ))



// const { paymentType, orderType, discount, orderMenus } = req.body;
    
// let totalPrice = "0.00"
// const orderMenusForCreate = [];
// const menuIds = [];
// for (let orderMenu of orderMenus) {
//   menuIds.push(orderMenu.menuId);
//   orderMenusForCreate.push({
//     amounts: orderMenu.amounts,
//     menus: {
//       connect: {
//         id: orderMenu.menuId,
//       },
//     },
//   });
// }

// const user = await prisma.users.findUnique({
//   where: {
//     id: req.user.id,
//   },
// });
// const menus = await prisma.menus.findMany({
//   where: {
//     id: {
//       in: menuIds,
//     },
//   },
// });
// const notFoundMenus = menus.filter((e) => !menuIds.includes(e.id));
// if (notFoundMenus.length > 0) {
//   return next(createError("Some menu ID not found", 404));
// }
// if (!user) {
//   return next(createError("User or Menu not found", 404));
// }

// if (notFoundMenus.length === 0 && user) {
//     for(let menu of menus) {
//         let amounts = orderMenus.filter(e => e.menuId === menu.id)[0].amounts
//         // console.log(`Amounts: ${amounts}`)
//         let floatTotalPrice = parseFloat(totalPrice) + parseFloat(menu.price)*parseFloat(amounts)
//         totalPrice = floatTotalPrice.toFixed(2)
//     }

//     // console.log(`TotalPrice: ${totalPrice}`)
//     if (discount !== "0.00") {
//         let floatTotalPrice = parseFloat(totalPrice)+parseFloat(discount)
//         totalPrice = floatTotalPrice.toFixed(2)
//     }


//     // console.log(`After Discount TotalPrice: ${totalPrice}`)
//   const newOrder = await prisma.orders.create({
//     data: {
//       userId: req.user.id, // assuming a user with ID 1 exists
//       paymentType,
//       orderType,
//       totalPrice, // should ideally be of type Float or Int
//       discount,
//       orderMenus: {
//         create: orderMenusForCreate,
//       },
//     },
//   });

//   res.status(201).json({ message: "Create order success", order: newOrder });
// }

// เอา orderMenus นับมา มาจัดรูปใหม่
// orderForCreate เอาไว้สำหรับ createOrders
// menuIds เอาไว้ findMany in
// ดึงค่าเช็ค user
// ดึงค่าเช็ค menus

// เช็คว่าเมนูไหนดึงแล้วไม่เจอ

// ถ้าเจอเมนูครบและ user มีค่า
 
// เอาเมนูมาวนค่า
// - แล้วรับ amounts 
// - รับ totalPrice = totalPrice+menu.price*amounts
// - เช็คว่ามี discount ไหม ถ้ามีเอามาหักลบ total
// - สร้าง orders, orderMenus