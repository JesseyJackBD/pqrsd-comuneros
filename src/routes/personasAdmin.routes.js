import { Router } from "express";
import pool from "../database.js";
import {/* auth *//* login, */ register, /* storeUser */} from "../controllers/LoginController.js";
import bcrypt from 'bcrypt'
import { isAdministrator } from "../helpers/auth.js";

const router = Router();

router.get('/central/register', isAdministrator, async(req, res) => {
try {
    if(req.session.loggedin == true){
    res.render('personasAdmin/register', { name: req.session.name,id_admin: req.session.id_admin });
    }else{
    res.redirect('/central')
} 
} catch (err) {
    res.render('personasAdmin/register', { message: err.message })
}
});

router.post('/central/register', isAdministrator,  async(req, res) => {
    try{
        const { nombre_administrador, email, password } = req.body;
        const newUser = { nombre_administrador, email, password }  

        const [unico] = await pool.query('SELECT * FROM administradores WHERE email = ?', [newUser.email])
        if (unico.length > 0 ) throw new Error ('Usuario ya existe') 
            
        const hashedPassword = await bcrypt.hash(newUser.password, 10)
        newUser.password = hashedPassword
        //console.log(newUser)
        await pool.query('INSERT INTO administradores SET ?', [newUser])
            
    res.redirect('/central')

    }catch(err){
        // res.status(500).json({message:err.message});
        res.render('personasAdmin/register', { message: err.message })
    }

});

router.get('/central/pswrd', isAdministrator, async(req, res) => {
    try{
        res.render('personasAdmin/pswrd', {name: req.session.name, id_admin: req.session.id_admin})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})
router.post('/central/pswrd', isAdministrator, async(req, res) => {

    try{
        const newUser = req.body;
    
        const [unico] = await pool.query('SELECT * FROM administradores WHERE email = ?', [newUser.email])
        if (unico.length < 1 ) { res.render('personasAdmin/pswrd', { message: 'Error: El correo no existe'}) }
    
        const hashedPassword = await bcrypt.hash(newUser.password, 10)
        newUser.password = hashedPassword
    
        await pool.query('UPDATE administradores SET password = ? WHERE email = ?;', [newUser.password, newUser.email]);

        res.redirect('/central')

    }catch(err){
        res.render('personasAdmin/pswrd', { message: err.message });
    }
})

router.get('/login', async(req, res) =>{
    if(req.session.loggedin != true){
        res.render('personasAdmin/login')
    }else{
        res.redirect('/central')
    }   
});

router.post('/login', async(req, res) => {
    try{
        const newUser = req.body;

        const [unico] = await pool.query('SELECT * FROM administradores WHERE email = ?', [newUser.email])
        //console.log(unico[0].id_administrador)
        
        if (unico.length > 0 ) {
            bcrypt.compare(newUser.password, unico[0].password, (err, isMatch) => {
                if(!isMatch){
                    res.render('personasAdmin/login', { err: 'Error: Contraseña incorrecta'})
                }else{
                    req.session.loggedin = true;
                    req.session.name = unico[0].nombre_administrador;
                    req.session.id_admin = unico[0].id_administrador;

                    res.redirect('/central' )
                }
            })
        }else{
            res.render('personasAdmin/login', { err: 'Error: Usuario no existe'})
        }
    }catch(err){
        res.status(500).json({message:err.message});
    }

});

router.get('/logout', async(req, res) =>{
    if(req.session.loggedin == true){
        req.session.destroy()
    }
    res.redirect('/')
})

export default router;