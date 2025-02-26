import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./data/users.json'));


const getUsers = (req,res)=>{
    res.json({
        message:"you get all users",
        data: data
    })
}
const createUser = (req,res)=>{
    if(!req.body.name||!req.body.email){
        res.send('name and price are required!');
    }
    const newUser = {...req.body,id:Date.now()}
         data.push(newUser)
        fs.writeFileSync('./data/users.json',JSON.stringify(data))
        res.json({
            message:"new user is created",
            data: newUser
        })
    }

const editUser = (req,res)=>{
    const userIndex = data.findIndex(user=>user.id===parseInt(req.params.id))
    const updatedUser = {...data[userIndex],...req.body}
         data.push(updatedUser)
        fs.writeFileSync('./data/users.json',JSON.stringify(data))
        res.json({
            message:"user updated",
            data:updatedUser
        })
}
const deleteUser = (req,res)=>{
    const filteredUser = data.filter(user=>user.id!==parseInt(req.params.id))
    fs.writeFileSync('./data/users.json',JSON.stringify(filteredUser))
    res.json({
        message:"user deleted",
    })
}

export {createUser,deleteUser,editUser,getUsers}