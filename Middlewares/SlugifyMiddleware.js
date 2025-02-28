import slugify from "slugify";
const productMiddleware = (req, res, next) => {
        req.body.slug = slugify(req.body.name,{lower:true})
    next(); 
};


export default productMiddleware