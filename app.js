const express = require('express');
const PORT = process.env.PORT || 9000
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {
    requireAuth,
    checkUser
} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// port listen
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

// database connection
const db = require('./config/connection')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log("Cannot connect to the database!", err)
        process.exit()
    })

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);