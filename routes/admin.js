const express = require('express');
const router = express.Router();
const { getAddProduct, getProduct, getEditProduct, postAddProduct, postEditProduct, postDeleteProduct } = require('../controller/admin.controller').default

// /admin/add-product => GET
router.get('/', getAddProduct);
router.get('/product/:page', getProduct);
router.get('/product', getProduct);
router.get('/edit/:id', getEditProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);
router.post('/edit-product', postEditProduct);
router.post('/delete-product', postDeleteProduct);

exports.routes = router;
