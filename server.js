const express = require('express');
const app = express();
app.disable('view cache');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const snekfetch = require('snekfetch');
const http = require('http').Server(app);
const port = 6262; // eslint-disable-line   

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/src`));
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const user = req.cookies.user;
    if(user) {
        res.redirect('home');
    }
    else
        res.render('index');
});

app.get('/home', async(req, res) => {
    const user = req.cookies.user;
    console.log(user);
    if(user) {
        const { body } = await snekfetch.get(`http://localhost:${port}/api/servers`);
        res.render('home', {user: user, servers: body});
    }
    else
        res.redirect('/');
});

let users = 0;
app.get('/login', (req, res) => {
    res.cookie('user' , {id: users, username: req.query.name});
    users++;

    res.redirect('/home');
});

app.get('/logoff', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

app.use('/api', require('./api.js'));

app.use((req, res) => {
    res.status(404).render('404');
});

http.listen(port, () => console.log(`ok ${port}`));