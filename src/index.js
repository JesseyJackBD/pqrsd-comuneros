import exp from 'constants';
import express, { urlencoded } from 'express'
import { engine } from 'express-handlebars';
// import morgan from 'morgan';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';
import personasRoutesAdmin from './routes/personasAdmin.routes.js'
import personasRoutes from './routes/personas.routes.js';
import personasRoutesExt from './routes/personasExt.routes.js'
import {PORT} from './config.js'



// import myconnection from 'express-myconnection';
import session from 'express-session';

//Inicializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set(PORT, process.env.PORT);
app.set('views',join(__dirname, 'views'));
app.engine('.hbs', engine({
    helpers: {
        when: ( function(operand_1, operator, operand_2, options) {
            var operators = {
            'eq': function(l,r) { return l == r; },
            'noteq': function(l,r) { return l != r; },
            'plus': function(l,r) { return Number(l) >= Number(r); },
            'minus': function(l,r) { return Number(l) <= Number(r); },
            'or': function(l,r) { return l || r; },
            'and': function(l,r) { return l && r; },
            '%': function(l,r) { return (l % r) === 0; }
            }
            , result = operators[operator](operand_1,operand_2);
        
            if (result) return options.fn(this);
            else  return options.inverse(this);
        })
    },
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Middlewares
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended:false}));
app.use(express.json());

//Public Files
app.use(express.static(join(__dirname, 'public')));

//Run Server
app.listen(app.get(PORT), ()=>
    console.log('Noah Mundo', app.get(PORT)));

//Session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//Routes
// app.get('/', (req, res) => {
//     if(req.session.loggedin == true) {
//         res.render('index', {name: req.session.name})
//     }else{
//         res.redirect('/login')
//     }
    
// })

app.get('/', (req, res) => {
    res.render('index')
})
app.use(personasRoutesAdmin);
app.use(personasRoutes);
app.use(personasRoutesExt);


