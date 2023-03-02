const { Products } = require('../model/Product')

const arrayUniqueByKey = (array, key) => [...new Map(array.map(item =>
    [item[key], item])).values()];


exports.default = {
    getAddProduct: (req, res, next) => {
        res.render('pages/admin/', {
            pageTitle: 'Add Product',
            url: req.originalUrl,
            layout: './layouts/tailwindLayout'
        });
    },

    getProduct: (req, res, next) => {
        let { page } = req.params
        if (!page)
            res.redirect('/admin/product/1');
        let { limit, type, brand } = req.query
        if (!limit) limit = 50
        Products.fetchAll(products => {
            let brands = arrayUniqueByKey(products, 'brand')
            let pages = { totalPages: Math.ceil(products.length / limit), currentPage: page, totalProducts: products.length, limit }
            if (type)
                products = products.filter(product => type.split(',').includes(product.type))
            if (brand)
                products = products.filter(product => brand?.split(',').includes(product.brand))
            // console.log(products);
            products = products.slice((page - 1) * limit, (page - 1) * limit + limit)
            return res.render('pages/admin/product', {
                pageTitle: 'Home Page',
                products: products,
                pages,
                url: req.originalUrl,
                layout: './layouts/tailwindLayout',
                brands: brands,
            });
        })
    },

    getEditProduct: (req, res, next) => {
        Products.fetchById(req.params.id, (products) => {
            return res.render('pages/admin/edit/', {
                pageTitle: 'Home Page',
                products: products,
                url: req.originalUrl,
                layout: './layouts/tailwindLayout'
            });
        })
    },

    postAddProduct: (req, res, next) => {
        // TODO: handle new product

        let store = new Products(req.body)
        store.save()
        res.redirect('/');
    },

    postEditProduct: (req, res, next) => {
        Products.updateProduct(req.body)
        res.redirect('/admin/product/1')
    },
    postDeleteProduct: (req, res, next) => {
        Products.deleteProduct(req.body.id)
        res.redirect('/admin/')
    }
}
