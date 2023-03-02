
const { createId } = require('@paralleldrive/cuid2');
const { SessionCart } = require('../model/SessionCart')
const { Products } = require('../model/Product')

exports.default = {

    // Middleware for session
    validateSession: (req, res, next) => {
        const maxAgeTimer = 60 * 60 * 1000
        const createSession = () => {
            // sqrt(36^(n-1)*26) with n = 24 => 4.0268498e+18 to reach 50% chance of collision.
            let data = new SessionCart(createId(), maxAgeTimer)
            data.save()
            res.cookie('session', data.id, { maxAge: maxAgeTimer, httpOnly: true, secure: true, signed: true });
        }

        if (!req.signedCookies.session) {
            createSession()
            next()
        }
        if (req.signedCookies.session) {
            SessionCart.fetchBySessionId(req.signedCookies.session, (session) => {
                if (session) {
                    res.cookie('session', req.signedCookies.session, { maxAge: maxAgeTimer, httpOnly: true, secure: true, signed: true });
                    next()
                } else {
                    createSession()
                    next()
                }

            })
        }
    },

    getCart: (req, res, next) => {
        if (!req.signedCookies.session)
            return res.redirect('/')
        SessionCart.fetchBySessionId(req.signedCookies.session, (session) => {
            let { cart } = session;
            Products.fetchBulk(cart, (fullDetailCartItem) => {
                return res.render('components/cartOffCanvas', {
                    cart: fullDetailCartItem,
                    layout: "./components/cartOffCanvas"
                })
            })
        })
    },

    addCart: (req, res, next) => {
        if (!req.signedCookies.session)
            return res.redirect('/')
        let { input } = req.body
        SessionCart.addToCart(input, req.signedCookies.session, (message) => {
            return res.send(message)
        })
    },


    updateCart: (req, res, next) => {
        if (!req.signedCookies.session)
            return res.redirect('/')
        let { input, method } = req.body
        SessionCart.updateCart(input, method, req.signedCookies.session, (session) => {
            let { cart } = session;
            Products.fetchBulk(cart, (fullDetailCartItem) => {
                return res.render('components/cartOffCanvas', {
                    cart: fullDetailCartItem,
                    layout: "./components/cartOffCanvas"
                })
            })
        })
    }
}