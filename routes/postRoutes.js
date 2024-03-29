const express=require('express');
const router=express.Router();

const postController=require('./../controllers/postController');

router
.route('/:id')
.get(postController.cache,postController.getPost)

module.exports= router;