const { Products } = require('../model/Product')

/**
 * shuffle and take 12
 * @param {*} array 
 * @returns 
 */
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array.slice(0, 12);
}

const arrayUniqueByKey = (array, key) => [...new Map(array.map(item =>
    [item[key], item])).values()];


exports.default = {
    getProducts: (req, res, next) => {
        Products.fetchAll(products => {
            return res.render('pages/home', {
                pageTitle: 'Home Page',
                products: products,
                brands: arrayUniqueByKey(products, 'brand'),
                newArrivals: shuffle(products),
                layout: './layouts/mainLayout'
            });
        })
    },
    getCategory: (req, res, next) => {
        let { slug, page } = req.params
        if (!page) return res.redirect(`/category/${slug}/1`)
        Products.fetchByCategory(slug, products => {
            if (products.length <= 0) {
                return next()
            }
            return res.render('pages/category', {
                pageTitle: 'Category ' + slug,
                products: products.slice((page - 1) * 12, (page - 1) * 12 + 12),
                paginate: { currentPage: page, totalPages: Math.ceil(products.length / 12) },
                layout: './layouts/mainLayout'
            });
        })
    },
    getProductById: (req, res, next) => {
        let { id } = req.params
        Products.fetchById(id, products => {
            if (!products) return next()
            return res.render('pages/product', {
                pageTitle: id,
                products: products,
                layout: './layouts/mainLayout'
            });
        })
    },
    getPolicy: (req, res, next) => {
        let { slug } = req.params
        return res.render('pages/policy/' + slug, {
            pageTitle: slug,
            layout: './layouts/mainLayout'
        });
    }
}
