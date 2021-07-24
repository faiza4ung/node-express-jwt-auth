const express = require('express');
const PORT = process.env.PORT || 9000
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

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
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes)

// cookies
app.get('/set-cookies', (req, res) => {

    // res.setHeader('Set-Cookie', 'newUser=true');

    res.cookie('newUser', false);
    res.cookie('isEmployee', true, {
        // 1000ms * 60s * 60 menit * 24 jam
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
        // output: document.cookie => value cookie yg di atas 
        // secure: true --if using https
        // httpOnly: true --if using http
    });

    res.send('yout got the cookie!');
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies.newUser);

    res.json(cookies);
});