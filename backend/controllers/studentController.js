const { Progress, Course } = require("../models");

exports.getCourses = async(req,res)=>{

  const courses = await Course.findAll();

  res.json(courses);

};


exports.getProgress = async(req,res)=>{

  const progress = await Progress.findAll({
    where:{studentId:req.user.id}
  });

  res.json(progress);

};