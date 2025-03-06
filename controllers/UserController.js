import User from '../models/User.js';

const getUsers = async(req,res)=>{
    const users = await User.find({});
    res.json({
        message:"you get all users",
        data:users
    })
}
const createUser =async (req,res)=>{
    const {name,username,email} = req.body
      const existingUser = await User.findOne({ email });
    if(!name||!username||!email){
        return res.status(400).json({message:'name, username and email are required',data:req.body})
    }
    if(existingUser){
        return res.status(400).json({message:'user email already exists'})
    }
    const newUser = new User({
          ...req.body,
          id: Date.now(),
        });
    await newUser.save()
    res.json({message:'User created',data:newUser})
}

const editUser =async (req,res)=>{
    const existingUser = User.findById(req.params.id)
    if(!existingUser){
        return res.status(400).json({message:"user doesn't exist"})
    }
    const user = await User.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
    res.json({message:"User updated",data:user})
}
const deleteUser = async(req,res)=>{
    const existingUser = User.findById(req.params.id)
    try {
        if(!existingUser){
            return res.status(400).json({message:"User doesn't exist"})
        }
        await User.findByIdAndDelete(req.params.id)
        res.json({message:"User deleted"})
    } catch (error) {
        return res.status(500).json({message:"Server error",error:error.message})
        
    }
}

export {createUser,deleteUser,editUser,getUsers}