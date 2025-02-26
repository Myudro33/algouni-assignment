const maintenanceMiddleware = ((req,res,next)=>{
    if(process.env.IsMaintenance=="true"){
        console.log('server is under maintenance');
    };
    
    next()
})

export default maintenanceMiddleware