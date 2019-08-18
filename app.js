const cookieParser            = require( 'cookie-parser' ),
      session                 = require( 'express-session' )
      flash                   = require( 'connect-flash' ),
      mongoose                = require( 'mongoose' ),
      express                 = require( 'express' ),
      morgan                  = require( 'morgan' ),
      app                     = express();
      methodOverride          = require('method-override'),
      passport                = require('passport'),
      localStrategy           = require('passport-local').Strategy;

// middlewares
app.use( morgan('dev') );
app.use(methodOverride('_method'));
app.use( express.json() );
app.use( express.urlencoded({limit: '50mb', extended: false}) );
app.set( 'view engine', 'pug' );
app.use( express.static( 'public' ) );
app.locals.moment = require('moment');
app.use( cookieParser('secret') );

app.use( session({
    cookie: { maxAge: 60000 },
    secret: 'Hello world',
    resave: true,
    saveUninitialized: true
}) );

// flash messages
app.use( flash() );


// passport setup


// middleware for flash messages
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    res.locals.url = req.url;
    next();
});

// var token = jwt.sign({
//     data: 'foobar'
//   }, 'secret', { expiresIn: '1m' });

// console.log(token);

// app.get('/token', (req, res) => {
//     try {
//         var x = jwt.verify(token, 'secret');
//         res.send(x);
//     } catch(err) {
//         res.send('Expired');
//     }
// });


// data models
const {Notice, AOPS} = require('./models');

// database
mongoose
    .connect( 'mongodb://localhost:27017/AOPS', {useNewUrlParser: true, useFindAndModify:false} )
    .then( con => console.log('Connected to database!') )
    .catch( err => console.log('Error connecting to database!') );

// seed database
const seed = require('./db-seed');
seed();

// routes
const noticeRoute = require('./routes/notice');
const dashboardRoute = require('./routes/dashboard');
const baseRoute = require('./routes/base');
const memberRoute = require('./routes/member');

app.use('/', baseRoute);
app.use('/notice', noticeRoute);
app.use('/dashboard', dashboardRoute);
app.use('/member', memberRoute);


app.listen( 3000, () => console.log('Server has started!') );