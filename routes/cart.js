const express = require('express');
const router = express.Router();
const { validateSession, getCart, addCart, updateCart } = require('../controller/cart.controller').default


// check session on all routes
router.use(validateSession)
router.get('/cart', getCart);
router.post('/addcart', addCart);
router.post('/updatecart', updateCart);



module.exports = router;
