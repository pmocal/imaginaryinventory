var express = require('express');
var router = express.Router();

// Require controller modules.
var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

router.get('/', item_controller.index);

// router.get('/items', item_controller.item_list);

// router.get('/item/create', item_controller.item_create_get);

// router.post('/item/create', item_controller.item_create_post);

// router.get('/item/:id', item_controller.item_detail);

// router.get('/item/delete', item_controller.item_delete_get);

// router.post('/item/delete', item_controller.item_delete_post);

// router.get('/item/update', item_controller.item_update_get);

// router.post('/item/update', item_controller.item_update_post);

router.get('/categories', category_controller.category_list);

// router.get('/category/create', category_controller.category_create_get);

// router.post('/category/create', category_controller.category_create_post);

router.get('/category/:id', category_controller.category_detail);

// router.get('/category/delete', category_controller.category_delete_get);

// router.post('/category/delete', category_controller.category_delete_post);

// router.get('/category/update', category_controller.category_update_get);

// router.post('/category/update', category_controller.category_update_post);

module.exports = router;