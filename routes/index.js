var express = require('express');
var router = express.Router();
const{mongodb,dbName,dbUrl} = require('../config/dbConfig');
const{mongoose,issueModel,issueTypeModel} = require('../config/dbSchema');


mongoose.connect(dbUrl)

// GET issue type model
router.get('/issue-types',async(req,res)=>{
  try {
    let issueTypes = await issueTypeModel.find();

    res.send({
      statusCode:200,
      issueTypes
    })
  } catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
})

// POST issue types
router.post('/issue-types',async(req,res)=>{
  try {
    let issueType = await issueTypeModel.create(req.body)
    res.send({
      statusCode:200,
      message: "Issue Type Created Successfully"
    })
  } catch (error) {
    console.log(error);
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
})

//UPDATE issue types
router.put('/issue-types/:id',async(req,res)=>{
  try {
    let issueType = await issueTypeModel.findOne({_id:mongodb.ObjectId(req.params.id)})
    if(issueType){
      issueType.issue_type = req.body.issue_type;
      await issueType.save();
      
      res.send({
        statusCode:200,
        message: "Issue Type Edited Successfully"
      })
    }else{
      res.send({
        statusCode:400,
        message:"Invalid Issue"
      })
    }
    
  } catch (error) {
    console.log(error);
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
})


//DELETE issue types
router.delete('/issue-types/:id',async(req,res)=>{
  try {
    let issueType = await issueTypeModel.deleteOne({_id:mongodb.ObjectId(req.params.id)})
    
    res.send({
      statusCode:200,
      message: "Issue Type Deleted Successfully"
    })
 
  } 
  catch (error) {
    console.log(error);
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
})

// POST issues 
router.post('/issues',async(req,res)=>{
  try {
    let issue = await issueModel.create(req.body)
    res.send({
      statusCode:200,
      issue_id:issue._id,
      message:"Issue Submitted Successfully"
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
});
//GET for admin to see all the tickets based on type
router.get('/issues-by-status/:status',async(req,res)=>{
  try {
    let issues = await issueModel.find({status:`${req.params.status}`})
    res.send({
      statusCode:200,
      issues
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
}); 

// GET Issues
router.get('/issues/:id',async(req,res)=>{
  try {
    let issue = await issueModel.find({_id:mongodb.ObjectId(req.params.id)})
    res.send({
      statusCode:200,
      issue
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
});

//GET for admin to see all the tickets based on type
router.get('/issues/:type',async(req,res)=>{
  try {
    let issue = await issueModel.find()
    res.send({
      statusCode:200,
      issue
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
}); 

//GET for admin to see all the tickets based on counts
router.get('/issues-count',async(req,res)=>{
  try {
    let open = await issueModel.find({status:"Open"}).count()
    let inProgress = await issueModel.find({status:"In-Progress"}).count();
    let closed = await issueModel.find({status:"Closed"}).count()
    res.send({
      statusCode:200,
      open,
      inProgress,
      closed
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
}); 

//PUT  to change the status 
router.put('/change-status/:id',async(req,res)=>{
  try {


    let issue = await issueModel.findOne({_id:mongodb.ObjectId(req.params.id)})
    switch (issue.status) {
      case 'Open':issue.status = 'In-Progress'
                  issue.comments=req.body.comments
                  issue.inProgressDate=new Date()
                  break;
      case 'In-Progress': issue.status ='Closed'
                          issue.comments=req.body.comments
                          issue.closedDate=new Date()
                          break;

    
      default:
        res.send({
          statusCode:400,
          message:'Invalid Current status'
        })
        break;
    }
    let result = await issue.save()
  
    res.send({
      statusCode:200,
      message:"Status Changed Successfully",
      result
    })
  } 
  catch (error) {
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
  }
}); 


module.exports = router;
