import bcrypt, { hash } from 'bcrypt';
import pool from "../database.js";

function register(req, res) {
  if(req.session.loggedin != true){
    res.render('personas/register');
  }else{
    res.redirect('/')
  } 
}

export {/* login */ register/* auth *//* storeUser */}

// function login(req, res) {
//   res.render('personas/login');
// }

// function auth(req, res) {
//   const data = req.body
//   console.log(data)
// }


// async function  storeUser (req, res) {
//   const {name, email, password} = req.body;
//         const newUser = {
//             name, email, password
//         }  

//   const data = req.body;



//   const user =data.findOne({ email })
//   if (user) throw new Error('username already exist')

//   const hashedPassword = await bcrypt.hash(data.password, 10)
//   await pool.query('INSER INTO users SET ?', [data])
//   console.log(data)
  
//   res.redirect('/login')
// }

//Copia Register

// router.get('/register', register);

// router.post('/register', async(req, res) => {
//     try{
//         const {email, name, password} = req.body;
//         const newUser = { email, name, password }  

//         const [unico] = await pool.query('SELECT * FROM users WHERE email = ?', [newUser.email])
//         if (unico.length > 0 ) throw new Error ('Usuario ya existe') 
            
//         const hashedPassword = await bcrypt.hash(newUser.password, 10)
//         newUser.password = hashedPassword
//         console.log(newUser)
//         await pool.query('INSERT INTO users SET ?', [newUser])
            
//     res.redirect('/login')

//     }catch(err){
//         // res.status(500).json({message:err.message});
//         res.render('personas/register', { message: err.message })
//     }

// });


// router.get('/login', async(req, res) =>{
//     if(req.session.loggedin != true){
//         res.render('personas/login')
//     }else{
//         res.redirect('/list')
//     }   
// });

// router.post('/login', async(req, res) => {
//     try{
//         const newUser = req.body;

//         const [unico] = await pool.query('SELECT * FROM users WHERE email = ?', [newUser.email])
        
//         if (unico.length > 0 ) {
//             bcrypt.compare(newUser.password, unico[0].password, (err, isMatch) => {
//                 if(!isMatch){
//                     res.render('personas/login', { err: 'Error: Contraseña incorrecta'})
//                 }else{
//                     req.session.loggedin = true;
//                     req.session.name = unico[0].name;

//                     res.redirect('/list')
//                 }
//             })
//         }else{
//             res.render('personas/login', { err: 'Error: Usuario no existe'})
//         }
//     }catch(err){
//         res.status(500).json({message:err.message});
//     }

// });

// router.get('/logout', async(req, res) =>{
//     if(req.session.loggedin == true){
//         req.session.destroy()
//     }
//     res.redirect('/')
// })