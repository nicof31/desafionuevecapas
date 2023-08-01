import { appConfig } from "../config/config.js";
const { NODE_ENV, PORT, DB_URL, SECRET_JWT, JWT_COOKIE_NAME } = appConfig;
import UserModel from "../dao/models/users.model.js";
import productsModel from "../dao/models/products.model.js";

class ViewsController {
    constructor(){
        this.userModel = UserModel;
        this.productsModel = productsModel;
       
    }

    getChatView = async (req,res) => { 
        try {
        const chat = "prueba chat web socket";
        return res.render('chat', { chat });
        } catch (error) {
        console.error(`ViewsController: No se puede obtener la vista de chat: ${error}`);
        return res.status(404).json({ status: "error", message: `ViewsController: No se puede obtener la vista de chat: ${error}` });
        }
    }

    getLoginView(req, res) {
        try {
        return res.render("user/login", {
            title: "Login",
            style: "home",
            logued: false,
        });
        } catch (error) {
        console.error("ViewsController: Error al renderizar la página de login:", error);
        return res.render("user/loginerror", { error: "Ocurrió un error al renderizar la página de login" });
        }
    }
  
    getHomePageView(req, res) {
        try {
        return res.render("user/login", {
            title: "Login",
            style: "home",
            logued: false,
        });
        } catch (error) {
        console.error("ViewsController: Error al renderizar la página de inicio:", error);
        return res.render("user/loginerror", { error: "Ocurrió un error al renderizar la página de inicio" });
        }
    }

    logout = async (req, res) => {
        try {
        res.clearCookie(JWT_COOKIE_NAME);
        res.redirect('/login');
        } catch (error) {
        console.error("ViewsController: Error al cerrar sesión:", error);
        res.status(500).send({ error: "ViewsController: Ocurrió un error al cerrar sesión" });
        }
    }

    getProductsView = async (req, res) => {
        try {
        // Utilizo los datos del usuario autenticado
        const { first_name, last_name, email, role, cart } = req.user.user;

        // Busco el id de cart ya que no lo paso por token ya que después va a cambiar
        const userFindCart = await this.userModel.findOne({ email }).exec();

        const limitDefault = 10;
        const pageDefault = 1;

        const findPage = parseInt(req.query.page) || parseInt(pageDefault);
        const findLimit = parseInt(req.query.limit) || parseInt(limitDefault);
        const sortOrder = req.query.sort == 'desc' ? -1 : 1;
        const queryCategory = req.query.category;
        const queryId =  parseInt(req.query.id);

        // Busco por categoria
        const findCategory = {}; 
        if (queryCategory) {
            findCategory.category = queryCategory;
        }
        // Busco por _id 
        if (queryId) {
            findCategory._id = queryId;
        }
        // Parametros de filtro
        const findBdProd = {
            page: findPage,
            limit: findLimit,
            sort: { price: sortOrder },
            lean: true
        };

        const productsPagination = await this.productsModel.paginate(findCategory, findBdProd);
            // Le paso a respuesta de products los link
            productsPagination.prevLink = productsPagination.hasPrevPage === true
                ? `http://localhost:8080/products/?page=${productsPagination.prevPage}&limit=5&sort=&category=&id=`
                : null;
            productsPagination.nextLink = productsPagination.hasNextPage === true
                ? `http://localhost:8080/products/?page=${productsPagination.nextPage}&limit=5&sort=&category=&id=`
                : null;
            productsPagination.isValid = !(findPage <= 0 || findPage > productsPagination.totalPages);
        
        const user = {
            first_name,
            last_name,
            email,
            role,
            cart: userFindCart.cart,
        };
        // Renderizo respuesta
        res.render('products', { user, productsPagination });
        } catch(error) {
        console.log(`Error al realizar la búsqueda paginada: ${error}`);
        return res.status(404).json({ status: "error", message: `Error al realizar la búsqueda paginada en BBBD ${error}` });
        }
    }

    getProfileView = (req, res) => {
        try {
        const { first_name, last_name, email, role } = req.user.user;
        const user = {
            first_name,
            last_name,
            email,
            role
        };
        res.render("user/profile", { user });
        } catch(error) {
        console.error(`ViewsController: Error al obtener la vista de perfil: ${error}`);
        return res.status(404).json({ status: "error", message: `ViewsController: Error al obtener la vista de perfil: ${error}` });
        }
    }

    getRegisterView = async (req, res) => {
        try {
        res.render("user/register", {
            title: "Registro",
            style: "home",
            logued: false,
        });
        } catch(error) {
        console.error(`ViewsController: Error al obtener la vista de registro: ${error}`);
        return res.status(500).json({ status: "error", message: `ViewsController: Error al obtener la vista de registro: ${error}` });
        }
    }

    getRecoverView = async (req, res) => {
        try {
        res.render("user/recover");
        } catch(error) {
        console.error(`ViewsController: Error al obtener la vista de recuperación de contraseña: ${error}`);
        return res.status(500).json({ status: "error", message: `ViewsController: Error al obtener la vista de recuperación de contraseña: ${error}` });
        }
    }


}



export default ViewsController;
