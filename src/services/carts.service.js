import cartsModel from "../dao/models/carts.model.js";
import UserModel from "../dao/models/users.model.js";
import CartsManagerMongo from "../dao/managers/cartsmanager.mongodb.js";

class CartService {
    constructor(){
        this.cartModel = cartsModel;
        this.userModel = UserModel;
        this.cartsManagerMongo = new CartsManagerMongo();

    }

    getAllCarts = async (req) => { 
        try {
            let cartsFilter = await this.cartModel.find();
            if (req.query.limit) {
                cartsFilter = await this.cartModel.find().limit(req.query.limit);
            }
            return cartsFilter;
        } catch (error) {
            console.log("cartService: no se pudo obtener carts" + error)
            throw error;
        }
    }

    getIdCarts = async (req) => {
        const cartId = req.params.cid;
        try {
          const cart = await cartsModel.findById(cartId)
            .populate('products.product')
            .lean();
      
          if (!cart) {
            return res.status(404).json({ message: 'El carrito no existe' });
          } else {
            cart.products.forEach(product => {
              product.totalPrice = product.quantity * product.product.price;
            });
            return cart;
          }
        } catch (error) {
          console.log(`CartService: no se pudo procesar la solcitud: ${error}`);
          return res.status(404).json({ status: "error", message: `CartService: no se pudo procesar la solcitud ${error}` });
        }
    }

   addToCart =  async(req) => {
        try {
          const idProductAddCart = req.params.pid.toString();
          const userEmail = req.user.email;
          const userId = req.user.id;
          const user = await UserModel.findOne({ email: userEmail });
          if (!user) {
            throw new Error("Usuario no encontrado");
          }
          const idCart = user.cart;
          if (!idCart) {
            throw new Error("Carrito no encontrado para este usuario");
          }
          const idCartDs = idCart.toString();
          const accion = req.query.accion;
          if (accion === "aumentar") {
            await this.cartsManagerMongo.addCartsPg(idCartDs, idProductAddCart, userId);
        } else if (accion === "disminuir") {
            await this.cartsManagerMongo.discountQuantityPro(idCartDs, idProductAddCart);
          } else {
            throw new Error("Acción no válida");
          }
          return { status: "success", message: `Cantidad ${accion} en el carrito` };
        } catch (error) {
          console.error(`cartService: error al procesar la petición POST: ${error}`);
          throw error;
        }
      }

    updateCarts = async(req) => {
        try {
            const idCartUpd = req.params.cid;
            const idProdUpd = req.params.pid;  
            const updateQuanityPut = req.body;
           //busco id de carts si existe en carts en base
           const cartSearchUpd = await this.cartModel.find();
           const searchIdCartUpd = cartSearchUpd.find(({ _id }) => _id == idCartUpd);
           if (!searchIdCartUpd) {
             return res.status(404).json({status:"error",message: `El  carrito _id: ${idCartUpd} buscado no existe, cargue un nuevo id`});
            } else {
                    //busco si el producto existe en el carrito
                    const upProductCart = searchIdCartUpd.products;
                    const upFilteredProduct = upProductCart .find(({ product }) => product ==  idProdUpd);
                    if (!upFilteredProduct) {
                      return res.status(404).json({status:"error",message: `El producto _id:'${idProdUpd}' buscado no existe en cart _id:'${idCartUpd}', cargue un nuevo id de producto`});
                    } else { 
                    const updCartNew = await this.cartsManagerMongo.updateQuantyCarts(idCartUpd,idProdUpd,updateQuanityPut);
                    return updCartNew
                }
                }
            } catch (error) {
              console.log(`No se puede procesar la peticion PUT '${error}'`);
              return res.status(404).json({status:"error",message: `cartService: No se puede procesar la peticion PUT '${error}'`});
            }
    }

    updateCartsComplet = async(req) => {
        try {
            const idCartUpd = req.params.cid;
            const updateProductPut = req.body;
           //busco id de carts si existe en carts en base
           const cartSearchUpd = await this.cartModel.find();
           const searchIdCartUpd = cartSearchUpd.find(({ _id }) => _id == idCartUpd);
           if (!searchIdCartUpd) {
             return res.status(404).json({status:"error",message: `cartService: El  carrito _id: ${idCartUpd} buscado no existe, cargue un nuevo id`});
            } else {
              const updCartNewComp = await this.cartsManagerMongo.updateProductsCarts(idCartUpd,updateProductPut);
              return updCartNewComp
                }
            } catch (error) {
              console.log(`cartService: No se puede procesar la peticion PUT '${error}'`);
              return res.status(404).json({status:"error",message: `cartService: No se puede procesar la peticion PUT '${error}'`});
            }
    }

    deleteProductCarts = async(req) => {
      try {
        const idCartDelete = req.params.cid;
        console.log("🚀 ~ file: carts.js:185 ~ routerCarts.delete ~ idCartDelete:", idCartDelete);
        const cart = await this.cartModel.findById(idCartDelete);
        if (!cart) {
          return res.status(404).json({ status: "error", message: `El carrito _id: ${idCartDelete} buscado no existe, cargue un nuevo id` });
        } else {
          //elimino lo productos dentro del carrito
          //await cartListMongo.deleteAllProductsCarts(idCartDelete);
          //Actualizo el carrito en la base de datos con un array de products vacio
          cart.products = [];
          await cart.save();
          return cart
        }
          } catch (error) {
            console.log(`cartService: No se puede procesar la peticion Delete '${error}'`);
            return res.status(404).json({status:"error",message: `cartService: No se puede procesar la peticion Delete '${error}'`});
          }
  }

    deleteOneProdCarts= async(req) => {
      try {
        const idCartDelete = req.params.cid;
        const idProductsCartDelete = req.params.pid;
        // Busco id de carts si existe en carts.json
        const cartSearchDelete = await this.cartModel.find();
        const searchIdCartDelete = cartSearchDelete.find(({ _id }) => _id == idCartDelete );
        if (!searchIdCartDelete) {
          return res.status(404).json({ status: "error", message: `cartService: El carrito _id: ${idCartDelete} buscado no existe, cargue un nuevo id` });
        } else {
          // Busco si el producto existe en el carrito
          const deleteProductCart = searchIdCartDelete.products;
          const deleteFilteredProduct = deleteProductCart.find(({ product }) => product == idProductsCartDelete);
          if (!deleteFilteredProduct) {
            console.log(`cartService: El producto buscado no existe en el carrito`);
            return res.status(404).json({ status: "error", message: `El producto _id:'${idProductsCartDelete}' buscado no existe, cargue un nuevo id` });
          } else {
            const cart = await this.cartsManagerMongo.deleteProductCarts(idCartDelete,idProductsCartDelete);
            console.log(`cartService: El producto buscado existe en el carrito y se puede eliminar`);
            return cart
          }
        }
          } catch (error) {
            console.log(`cartService: No se puede procesar la peticion Delete '${error}'`);
            return res.status(404).json({status:"error",message: `cartService: No se puede procesar la peticion Delete '${error}'`});
          }
  }

}

export default CartService;
