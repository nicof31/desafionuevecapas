import ProductsService from "../services/products.service.js";
import productsModel from "../dao/models/products.model.js";

class ProductsController {
    constructor(){
        this.productService = new ProductsService();
        this.productModel = productsModel;
    }

    getIdProducts = async (req, res) => {
        try {
            const product = await this.productService.getIdProducts(req);
            return res.status(200).json({status:"productController: success, el id buscado es:",message:{ product }});
        } catch (error) {
            console.log(`productController: No se puede procesar la peticion GET '${error}'`);
            return res.status(404).json({status:"error",message: `productController: No se puede procesar la peticion GET '${error}'`});
                }
    }

    getCombProducts = async (req, res) => {
        try {
            const productsPagination = await this.productService.getCombProducts(req);
            return res.status(200).json({ status: "productController: success mongoose", payload: productsPagination });
        } catch (error) {
            console.log(`productController: No se puede procesar la peticion GET '${error}'`);
            return res.status(404).json({status:"error",message: `productController: No se puede procesar la peticion GET '${error}'`});
        }
    }

    addToProduct =  async(req, res) => {
        try {
            const crearProducto = req.body;
            if (!crearProducto.title || !crearProducto.description || !crearProducto.code || !crearProducto.price || !crearProducto.status || !crearProducto.category || !crearProducto.stock) {
              return res.status(400).send({status:"error",message:"productController: Incomplete values"});
            } 
            const findCode = await this.productModel.find();
            const codeVerf = findCode.find(({ code })=> code == crearProducto.code);
            if (codeVerf != null) {
              return res.status(409).json({status:"error",message: `El código '${crearProducto.code}'de producto existe en otro producto, cargue un nuevo código de producto`});
            } else {
            const addProduct = await this.productService.addToProduct(req);
            return res.status(200).json({ status: "productController: success mongoose", payload: addProduct});
            }
        } catch (error) {
            console.log(`productController: No se puede procesar la peticion POST '${error}'`);
            return res.status(404).send({status:"error",message: `productController: No se puede procesar la peticion POST '${error}'`});
        }
    }

    updateProductsComplet = async (req,res) => {
        try {
            const actualizarProducto = req.body;
            const idUpdate = req.params.pid;
            if (!actualizarProducto.title || !actualizarProducto.description || !actualizarProducto.code || !actualizarProducto.price || !actualizarProducto.status || !actualizarProducto.category || !actualizarProducto.stock) {
            return res.status(400).json({status:"error",message:"productController: Incomplete values"});
            };
            const findCodeUpC = await productsModel.find();
            const idFindUpdate = findCodeUpC.find(({ _id })=> _id == idUpdate);
            if(idFindUpdate == null){
            return res.status(404).json({status:"error",message: `productController: El id de producto buscado no existe, cargue un nuevo id`});
            } else {
            const codDeProdBuscadoId = findCodeUpC.find(({ code })=> code === actualizarProducto.code);
            if (codDeProdBuscadoId !=null){
            return res.status(409).json({status:"error",message: `productController: El código de producto existe en otro producto, cargue un nuevo código de producto`});
            } 
            else{
            const updateProductComp = await this.productService.updateProductsComplet(req);
            return res.status(200).json({ status: "productController: success mongoose", payload: updateProductComp});
            }
            }
        } catch (error){
            console.log(`productController: No se puede procesar la peticion PUT '${error}'`);
            return res.status(400).json({status:"error",message: `productController: No se puede procesar la peticion PUT '${error}'`});
        }
    }

    updateProductsPatch = async (req,res) => {
        try {
            const updateParamPatch = req.body;
            const idUpdatePatch = req.params.pid;
            const findCodeUpdatePatch = await productsModel.find();
            const idVerfUpdatePatch = findCodeUpdatePatch.find(({ _id })=> _id == idUpdatePatch);
         
            if (idVerfUpdatePatch != null) { 
              console.log("el producto id existe y se puede modificar");
              const codDeProdPatchId = findCodeUpdatePatch.find(({ code })=> code == req.body.code);
              if (codDeProdPatchId  !=null){
              return res.status(409).json({status:"error",message: "productController: El código de producto existe en otro producto, cargue un nuevo código de producto"});
              } else {
              const newObjUpdate = await this.productService.updateProductsPatch(req)
              return res.status(200).json({ status: "productController: success mongoose", payload: newObjUpdate});
             }
            } else {
              return res.status(404).json({status:"error",message: "productController: El id de producto buscado no existe, cargue un nuevo id"});
              }
        } catch (error){
            console.log(`productController: No se puede procesar la peticion PATCH '${error}'`);
            return res.status(400).json({status:"error",message: `productController: No se puede procesar la peticion PATCH '${error}'`});
        }
    }

    deleteProduct =  async(req, res) => {
        try {
            const idProdDelet = req.params.pid;
            const findCodeDelete = await this.productModel.find();
            const idVerfDelete= findCodeDelete .find(({ id })=> id == idProdDelet);
            if (idVerfDelete == null) {
              return res.status(404).json({status:"error",message: "productsController: El id de producto buscado no existe, cargue un nuevo id"});
            }
            const productIdDelet = await this.productService.deleteProduct(req);
            return res.status(200).json({ status: "productController: success mongoose", payload: productIdDelet});
        } catch (error) {
            console.log(`productsController: No se puede procesar la peticion Delete '${error}'`);
            return res.status(404).json({status:"error",message: `productsController: No se puede procesar la peticion Delete '${error}'`});
        }
    }

}

export default ProductsController;