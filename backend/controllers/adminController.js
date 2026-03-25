const { User } = require("../models");

exports.getUsers = async(req,res)=>{

  const users = await User.findAll();

  res.json(users);

};

exports.deleteUser = async(req,res)=>{

  await User.destroy({
    where:{id:req.params.id}
  });

  res.json({message:"User deleted"});

};