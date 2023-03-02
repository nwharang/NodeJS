const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cartRoutes = require('./routes/cart');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { SessionCart } = require('./model/SessionCart')

const app = express();
const secret = process.env.SECRET || "hello,world!"

app.use(cookieParser(secret))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Session-Cookie base cart route
app.use(cartRoutes);
app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use((req, res, next) => {
    res.status(404).render('pages/404',
        {
            pageTitle: 'Page Not Found',
            path: '/404',
            layout: './layouts/mainLayout',
        });
});

app.listen(3000, () => {
    console.log("Running on http://localhost:3000");
    SessionCart.sessionCleanup()
    setInterval(() => {
        SessionCart.sessionCleanup()
    }, 15 * 60 * 1000);
});
