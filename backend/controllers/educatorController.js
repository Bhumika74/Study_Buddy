const { Course, Assignment } = require("../models");

exports.createCourse = async(req,res)=>{

  const course = await Course.create(req.body);

  res.json(course);

};

exports.createAssignment = async(req,res)=>{

  const assignment = await Assignment.create(req.body);

  res.json(assignment);

};