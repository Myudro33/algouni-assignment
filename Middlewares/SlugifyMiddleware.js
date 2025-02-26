import slugify from "slugify";
const productMiddleware = (req, res, next) => {
    if (req.method === "POST" && req.path === "/products") {

        req.body.name = slugify(req.body.name)
    }
    next(); 
};


export default productMiddleware