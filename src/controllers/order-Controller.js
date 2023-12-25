const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.createOrder = async (req, res, next) => {
  try {
    const order = req.body;

    // amount กับ menuId
    const orderMenus = req.body.orderMenus;

    // map หาค่า amount กับ menuId
    const toCreateOrderMenus = orderMenus.map((e) => {
      return {
        menuId: +e.menuId,
        amounts: +e.amounts,
      };
    });

    // console.log(toCreateOrderMenus);

    // return object ของ menuId ที่ client ส่งมา 1 orders > 1 menuIds
    const menuIds = orderMenus.map((e) => {
      return e.menuId;
    });

    // menuIds นำมา check กับ menus table ว่ามีค่าไหม
    const menus = await prisma.menus.findMany({
      where: {
        id: {
          in: menuIds,
        },
      },
    });

    let totalPrice = 0;
    menus.map((el) => {
      const targetMenu = orderMenus.find((menu) => menu.menuId === el.id);
      const sumMenuPrice = el.price * targetMenu.amounts;
      totalPrice += sumMenuPrice;
    });

    // ถ้ามี discount
    // vat 7%
    let afterPriceDiscount = totalPrice * (order.discount / 100);
    totalPrice -= afterPriceDiscount;
    totalPrice += totalPrice * 0.07;

    //  console.log(afterPriceDiscount)
    //  console.log(totalPrice)

    // menus.length = 0 mean no data in database
    if (menus.length == 0) {
      return next(createError("menuId not found in database", 400));
    }

    // เอาค่า menuIds ที่ได้ ไป check ว่าราคาเท่าไรห่

    // หา user
    // const user = await prisma.users.findUnique({
    //   where: {
    //     id: req.user.id,
    //   },
    // });

    // ถ้า user ไม่มี ค่า
    // if (!user) {
    //   return next(createError("user not found", 400));
    // }

    // delete user.password;

    const createOrder = await prisma.orders.create({
      data: {
        userId: req.user.id,
        totalPrice: totalPrice.toFixed(2).toString(),
        discount: order?.discount,
        paymentType: order?.paymentType,
        orderType: order?.orderType,
        status: order?.status,
        orderMenus: {
          create: toCreateOrderMenus,
        },
      },
    });

    res.status(200).json({createOrder });
  } catch (error) {
    next(error);
  }
};
/////////////
exports.getOrderById = async (req, res, next) => {
  try {
    let orderId = req.params.orderId;
    if (typeof orderId !== "number") orderId = parseInt(orderId)
    const orderDetail = await prisma.Orders.findMany({
      where: {
        id: orderId,
      },
      include: {
        orderMenus: {
          include: {
            menus: true,
          },
        },
        users: {
          select: {
            firstName: true,
          },
        },
      },
    });
    res.status(200).json({ orderDetail:orderDetail[0] });
  } catch (error) {
    next(error);
  }
};

//////// orderStatus (waiting,void,complete) ////////
exports.orderStatus = async (req,res,next) =>{
  try {
    const orderId = req.params.orderId

     await prisma.orders.update({
      where : {
        id : +orderId
      },data : {
        status : "VOID"
      }
    })

    // const historyWithOutVoid = await prisma.orders.findMany({
    //   where: {
    //     NOT: {
    //       status: "VOID"
    //     },
    //     id : true
    //   },
    //   select: {
    //     users: {
    //       select: {
    //         firstName: true
    //       }
    //     }
    //   }
    // });
    
    
    
    res.status(200).json({ message : "Change status success"});
  } catch (error) {
    next(error)
  }
}
