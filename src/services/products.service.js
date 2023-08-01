import productsModel from "../dao/models/products.model.js";
import UserModel from "../dao/models/users.model.js";
import ProductManagerMongo from "../dao/managers/productManager.mongodb.js";

class ProductsService { 
    constructor(){
        this.productModel = productsModel;
        this.userModel = UserModel;
        this.productManagerMongo = new ProductManagerMongo();

    }

    getIdProducts = async (req) => {
        try{
            const idProducts= req.params.pid;
            const busquedaIdProd = await this.productManagerMongo.productById(idProducts)
           
            console.log(busquedaIdProd )
            if (busquedaIdProd .length == 0) {
            return res.status(404).json({status:"error",message: "productService: El id de producto buscado no existe, cargue un nuevo id"});
            }
            return busquedaIdProd ;
          } catch (error) {
            console.log(`productService: No se puede procesar la peticion GET '${error}'`);
            //return res.status(404).json({status:"error",message: `productService: No se puede procesar la peticion GET '${error}'`});
            throw error;  
        };
    }

    getCombProducts = async (req) => {
        try {
            const limitDefault = 10;
            const pageDefault = 1;   
            const findPage = parseInt(req.query.page) || parseInt(pageDefault);
            const findLimit = parseInt(req.query.limit) || parseInt(limitDefault); 
            const sortOrder = req.query.sort == 'desc' ? -1 : 1;
            const queryCategory = req.query.category;
            const queryId =  parseInt(req.query.id);
        
            //Busco por categoria
            const findCategory = {}; 
            if (queryCategory) {
              findCategory.category = queryCategory;
            };
            // Busco por _id 
            if (queryId) {
              findCategory._id = queryId;
            };
            //Parametros de filtro
            const findBdProd = {
              page: findPage,
              limit: findLimit,
              sort: { price: sortOrder },
              lean: true
            };
        
            const productsPagination = await this.productModel.paginate(findCategory, findBdProd);
        
            //le paso a respuesta de products los link
            productsPagination.prevLink = productsPagination.hasPrevPage === true
                ? `http://localhost:8080/api/products/?page=${productsPagination.prevPage}&limit=5&sort=&category=&id=`
                : null;
        
            productsPagination.nextLink = productsPagination.hasNextPage === true
              ? `http://localhost:8080/api/products/?page=${productsPagination.nextPage}&limit=5&sort=&category=&id=`
              : null;
        
            productsPagination.isValid= !(findPage<=0||findPage> productsPagination.totalPages)
            return productsPagination ;
          } catch(error) {
            console.log(`productService: Error al realizar la búsqueda paginada: ${error}`);
            //return res.status(404).json({status:"error",message: `productService: Error al realizar la búsqueda paginada en BBBD ${error}`});
            throw error; 
        }
    }

    addToProduct =  async(req) => {
        try {
            const crearProducto = req.body;
            const newProduct = await this.productManagerMongo.addProduct(crearProducto.title, crearProducto.description, crearProducto.code, crearProducto.price, crearProducto.status, crearProducto.category, crearProducto.thumbnail,crearProducto.stock);     
            return newProduct ;

          } catch (error) {
            console.log(`productService: No se puede procesar la peticion POST '${error}'`);
            //return res.status(404).send({status:"error",message: `productService: No se puede procesar la peticion POST '${error}'`});
            throw error;  
        }
        }

    updateProductsComplet = async (req) => {
        try {
            const actualizarProducto = req.body;
            const idUpdate = req.params.pid;    
            const findCodeUpC = await this.productModel.find();
            const idFindUpdate = findCodeUpC.find(({ _id })=> _id == idUpdate);
            let passThumbnail;
            if(actualizarProducto.thumbnail != null){
            passThumbnail = actualizarProducto.thumbnail;
            } else {
            passThumbnail = idFindUpdate.thumbnail ;
            };
            const newUpdateCom  = await this.productManagerMongo.updateProduct(idUpdate, actualizarProducto.title, actualizarProducto.description, actualizarProducto.code, actualizarProducto.price, actualizarProducto.status, actualizarProducto.category, passThumbnail ,actualizarProducto.stock);
            return newUpdateCom      

        } catch (error){
            console.error(`productService: error al procesar la petición PUT: ${error}`);
            throw error;
        }
    }

    updateProductsPatch = async (req) => {
        try {
            const updateParamPatch = req.body;
            const idUpdatePatch = req.params.pid;
            const findCodeUpdatePatch = await this.productModel.find();
            const idVerfUpdatePatch = findCodeUpdatePatch.find(({ _id })=> _id == idUpdatePatch);
            const newObjUpdate = Object.assign(idVerfUpdatePatch,updateParamPatch);
            await this.productManagerMongo.updateParam(newObjUpdate);
            return newObjUpdate;           
        } catch (error){
            console.error(`productService: error al procesar la petición PATCH: ${error}`);
            throw error;
        }
    }

    deleteProduct =  async(req) => {
        try {
            const idProdDelet = req.params.pid;
            const productIdDelet = await this.productManagerMongo.deleteProduct(idProdDelet);
            return productIdDelet;
        } catch (error) {
            console.error(`productService: error al procesar la petición DELETE: ${error}`);
            throw error;
        }
    }

}

export default ProductsService;
