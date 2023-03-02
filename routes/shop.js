const express = require('express');
const router = express.Router();
const { getProducts, getCategory, getProductById, getPolicy } = require('../controller/product.controller').default


// check session on all routes
router.get('/', getProducts);
router.get('/category/:slug', getCategory);
router.get('/category/:slug/:page', getCategory);
router.get('/product/:id', getProductById);
router.get('/policy/:slug', getPolicy);


module.exports = router;
