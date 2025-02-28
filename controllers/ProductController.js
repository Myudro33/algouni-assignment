import fs from 'fs'


const data = JSON.parse(fs.readFileSync('./data/data.json'));



const getProducts  = (req,res)=>{
    res.json(data)  
    }
const createProduct = (req,res)=>{
    if(!req.body.name||!req.body.price){
    res.send('name and price are required!');
    }else{
        if(!data.some(e=>e.name===req.body.name)){
            const newProduct = {...req.body,id:Date.now(),createdAt:new Date().toISOString()}
            data.push(newProduct)
            fs.writeFileSync('./data/data.json',JSON.stringify(data))
            res.json({
                message:"new product is created",
            })
        }else{
            res.json({
                message:"name already exists",
            })
        }
    }
    
}
const updateProduct = (req,res)=>{
    const productIndex = data.findIndex(item=>item.id=== parseInt(req.params.id))
    const newProduct = {...data[productIndex],...req.body}
    data[productIndex ] = newProduct
        fs.writeFileSync('./data/data.json',JSON.stringify(data))
        res.json({
            message:"Product updated",
            data:data[productIndex]
        })
}
const deleteProduct = (req,res)=>{
    const newProducts = data.filter((product)=>product.id!==parseInt(req.params.id))
    fs.writeFileSync("./data/data.json", JSON.stringify(newProducts)); 
    res.json({
        message:"Product is deleted successfully",
    })
}
const buyProduct = (req,res)=>{
    const productId = parseInt(req.params.id)
    const productIndex = data.findIndex((product)=>product.id===productId)
    if(data[productIndex].stock<1){
        res.status(406).send({message:'stock is 0'})
    }
    data[productIndex] = {...data[productIndex],stock:data[productIndex].stock-1}
    fs.writeFileSync('./data/data.json',JSON.stringify(data))
    res.json({
        message:"you bought that product",
        data:data[productIndex]
    })
}


export {getProducts,buyProduct,createProduct,deleteProduct,updateProduct}