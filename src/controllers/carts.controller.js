import CartService from "../services/carts.service.js";

class CartsController {
    constructor(){
        this.cartService = new CartService();
    }

    getAllCarts = async (req, res) => {
        try {
            const carts = await this.cartService.getAllCarts(req); 
            return res.status(200).json({ message: `cartController: getAllCarts`, carts });
        } catch (error) {
            console.log(`cartController: No se pudo obtener cart en la base de datos ${error}`)
            return res.status(404).json({status: "error", message: `No se pudo obtener cartten la base de datos ${error}`});
        }
    }

    getIdCarts = async (req, res) => {
        try {
            const cart = await this.cartService.getIdCarts(req);
            if (req.query.historycart === "true") {
                return res.render("carts/findcarthistory", { cart });
            } else {
                return res.render("carts/carts", { cart });
            }
        } catch (error) {
            console.log(`cartController: No se pudo obtener cart en la base de datos ${error}`);
            return res.status(404).json({ status: "error", message: `No se pudo obtener cart en la base de datos ${error}` });
        }
    }

    addToCart = async (req, res) => {
        try {
          const addCartQuan = await this.cartService.addToCart(req);
          //return res.status(200).json(addCartQuan);
          return res.status(200).json({ status: "cartController: success mongoose", payload: addCartQuan });

        } catch (error) {
          console.error(`cartsController: Error al procesar la petición POST: ${error}`);
          return res.status(500).json({ status: "error cartsController", message: "No se puede procesar la petición POST" });
        }
      };

    updateCarts = async (req, res) => {
        try {
          const updateCart = await this.cartService.updateCarts(req);   
          //return res.status(200).json({ message: `cartController: updateCarts`, updateCart});
          return res.status(200).json({ status: "cartController: success mongoose", payload: updateCart });

        } catch (error){
          console.log(`cartsController: No se puede procesar la peticion PUT '${error}'`);
          return res.status(404).json({status:"error",message: `cartsController: No se puede procesar la peticion PUT '${error}'`});
        }
    } 

    updateCartsComplet = async (req,res) => {
        try {
          const updateCartCompl = await this.cartService.updateCartsComplet(req); 
         // return res.status(200).json({ message: `cartController: updateCartsComplet`, updateCartCompl});
          return res.status(200).json({ status: "cartController: success mongoose", payload: updateCartCompl });
        } catch (error){
          console.log(`No se puede procesar la peticion PUT '${error}'`);
          return res.status(404).json({status:"error",message: `cartsController: No se puede procesar la peticion PUT '${error}'`});
        }
    }

    deleteProductCarts = async (req,res) => {
      try {
        const deleteProductCart = await this.cartService.deleteProductCarts(req); 
        return res.status(200).json({ message: `cartController: Se eliminaron todos los productos del carritos con el metodo deleteProductCart`, deleteProductCart});
      } catch (error){
        console.log(`cartsController: No se puede procesar la peticion Delete '${error}'`);
        return res.status(404).json({status:"error",message: `cartsController: No se puede procesar la peticion Delete '${error}'`});
      }
    }

    deleteOneProdCarts = async (req,res) => {
      try {
        const deleteOneProdCart = await this.cartService.deleteOneProdCarts(req); 
        return res.status(200).json({ message: `cartController: Se elimino el producto correcamente del carrito con el metodo deleteOneProdCart`, deleteOneProdCart });
      } catch (error){
        console.log(`cartsController: No se puede procesar la peticion Delete '${error}'`);
        return res.status(404).json({status:"error",message: `cartsController: No se puede procesar la peticion Delete '${error}'`});
      }
    }

}

export default CartsController;
