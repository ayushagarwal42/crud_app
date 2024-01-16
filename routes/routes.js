const express = require("express");
const router = express.Router();
const User = require("../models/users");
// const multer = require("multer");
const upload=require('../multer/multer');
const fs=require('fs');



// insert an user into database route
router.post("/add", upload, async(req, res) => {
    try{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        await user.save();

        req.session.message = {
            type: "success",
            message: "User added successfully",
        };
        res.redirect("/");
    }catch(err){
        console.error(err);
        res.json({
            message: err.message,
            type: "danger",
        });
    }  
});

//get all users route
router.get("/", async(req, res) => {
    try {
        const users = await User.find().exec();
        res.render("index", {
            title: "HomePage",
            users: users,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// edit an user route
router.get('/edit/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id)

        if(!user){
            res.redirect('/');

        }else{
            res.render("edit_users",{
                title:"Edit User",
                user:user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});

router.post('/update/:id',upload,async(req,res)=>{
    try {
        const id = req.params.id;
        let new_image='';

        if(req.file){
            new_image=req.file.filename;
            try{
                fs.unlinkSync('./uploads/'+req.body.old_image);
            }catch(err){
                console.log(err);
            }
        }else{
            new_image=req.body.old_image;
        }

        const user = await User.findByIdAndUpdate(id,{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:new_image,
        })
        if(user){
            console.log('user updated successfully');
            req.session.message={
                type:'success',
                message:'user updated successfully',
            }
            res.redirect('/');
            // res.redirect('/edit/${id}');
        }else{
            console.log('user not found');
            res.redirect('/');
        }

    } catch (error) {
        res.redirect('/');
    }
});

module.exports = router;
