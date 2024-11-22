import { Router } from "express";
import pool from "../database.js";
import {/* auth *//* login, */ register, /* storeUser */} from "../controllers/LoginController.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

router.get('/central', isAuthenticated, async(req, res) => {
    res.render('central', {name: req.session.name, id_admin: req.session.id_admin})
})

router.get('/central/list', isAuthenticated, async(req, res) =>{
    try{              
        
        const [resultTotal] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, locales.id_usuario AS usuario, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC LIMIT 50;');  
        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM pqrsds WHERE id_estado = 3;')
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];        
        
        res.render('personas/list', {personas: resultTotal, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name })
    }catch(err){
        res.status(500).json({message:err.message});
        

    }
})

router.get('/central/notify', isAuthenticated, async(req,res) =>{
    try {

        const [resultTotal] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto, nombre_despachado FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado INNER JOIN despachados ON pqrsds.id_despachado = despachados.id_despachado WHERE pqrsds.id_estado = 1 ORDER BY fecha DESC;');

        const resultTotal1 = resultTotal.map((persona) => {
            //Fechas
            const time = new Date(persona.fecha);
            const actTime = new Date();
            //FormatoFechas
            const formattedDate = `${actTime.getFullYear()}-${actTime.getMonth() + 1}-${actTime.getDate()}`;
            const days = Date.parse(formattedDate) - Date.parse(time)
            const Difference_In_Days = Math.round (days / (1000 * 3600 * 24));
            // Numero de semanas
            var diff =(time.getTime() - actTime.getTime()) / 1000;
            diff /= (60 * 60 * 24 * 7);
            const weekdends = Math.abs(Math.round(diff));
            // Restar fines de semana
            var workDays = Difference_In_Days - (weekdends*2) 
            var resDays = 15 - workDays
            var solDays = 10 - workDays

                return {...persona, workDays, resDays, solDays}
            } ) 

            res.render('personas/pending', {personas: resultTotal1, name: req.session.name })

    } catch (err) {
        res.status(500).json({message:err.message});

    }
})

router.post('/central/list-search', isAuthenticated, async(req, res) => {
    try {

        const search = req.body.search       
        
        const [resultSearch] = await pool.query(`SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado WHERE pqrsds.id_local LIKE '%' ? '%' ORDER BY fecha DESC;`, [search]);


        // const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 2 AND pqrsds.id_local = ?;', [search])
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM pqrsds WHERE id_estado = 3 AND pqrsds.id_local = ?;', [search])
        // const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];
        
        // const resultSearch1= resultSearch.map((persona) => {
        //     return {...persona, search}

        //     } ) 
        res.render('personas/search', {personas: resultSearch, busqueda: search, name: req.session.name /* contarPendiente: cPendiente, contarEspera: cEspera */})           

    } catch (err) {
        res.status(500).json({message:err.message});
        // res.render('personas/list', { message: err.message })
    }
})

router.post('/central/list-searchUser', isAuthenticated, async(req, res) => {
    try {

        const search = req.body.search       
        
        const [resultSearch] = await pool.query(`SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado WHERE nombre_usuario LIKE '%' ? '%' ORDER BY fecha DESC;`, [search]);

        res.render('personas/searchUser', {personas: resultSearch, busqueda: search, name: req.session.name /* contarPendiente: cPendiente, contarEspera: cEspera */})           

    } catch (err) {
        res.status(500).json({message:err.message});
        // res.render('personas/list', { message: err.message })
    }
})

router.get('/central/list-cat/:id', isAuthenticated, async(req, res) => {  
    try{   

        const {id} = req.params;

        const [resultTotal] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado WHERE pqrsds.id_estado = ? ORDER BY fecha DESC;', [id]);           

        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM pqrsds WHERE id_estado = 3;')
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];
        res.render('personas/list', {personas: resultTotal, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name})

    }catch(err){
        res.status(500).json({message:err.message});
    }

})

router.get('/central/list-page', isAuthenticated, async(req, res) => {

        const [users] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC;')
        
        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM pqrsds WHERE id_estado = 3;')
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];

        const {page, limit} = req.query
        const offset = (page - 1) * limit
        const [data] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC limit ? offset ?', [+limit, +offset])
        const [totalPageData] = await pool.query ('SELECT COUNT(*) AS count FROM pqrsds')
        const totalPage = Math.ceil(+totalPageData[0]?.count / limit)
        //Probando
        // console.log(totalPage)
        /*
        res.json({
            data: data,
            pagination: {
                page: +page,
                limit: +limit,
                totalPage
            }
        })
        */
        /*
        const page = req.query.page
        const limit = req.query.limit

        const starIndex = (page - 1) * limit
        const endIndex = page * limit
        
        const resultUsers = users.slice(starIndex, endIndex)
        console.log(resultUsers)
        */
        res.render('personas/list', {personas: data, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name})

})

router.get('/central/list-page-2', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 50')
    
    res.render('personas/list', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-page-3', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 100')
    
    res.render('personas/list', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-page-4', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 150')
    
    res.render('personas/list', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-page-5', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 200')
    
    res.render('personas/list', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})

router.get('/central/add', isAuthenticated, async(req,res) =>{
    
    const [categoria] = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias;');
    const [estado] = await pool.query('SELECT id_estado, nombre_estado FROM estados;');
    const [despachado] = await pool.query('SELECT id_despachado, nombre_despachado FROM despachados;');
    const [administrador] = await pool.query('SELECT id_administrador, nombre_administrador FROM administradores WHERE id_administrador = ?;',[req.session.id_admin]);
    res.render('personas/add', {seleccionCategoria: categoria, seleccionEstado: estado, seleccionAdministrador: administrador, seleccionDespachado:despachado, name: req.session.name});
    
})
router.post('/central/add', isAuthenticated, async(req,res) => {
    try{
        const {id_pqrsd, id_local, id_categoria, id_estado,  asunto, fecha, id_administrador, id_despachado} = req.body;
        const newPqrsd = {
            id_pqrsd, id_local, id_categoria, id_estado,  asunto, fecha, id_administrador, id_despachado
        }        

        const [unicoL] = await pool.query('SELECT * FROM pqrsds WHERE id_local = ?', [newPqrsd.id_local])
        const [unicoP] = await pool.query('SELECT * FROM pqrsds WHERE id_pqrsd = ?', [newPqrsd.id_pqrsd])
        
        if (unicoL.length < 1 ) { res.render('personas/add', { message: 'Error: El local no existe'}) }
        if (unicoP.length > 0  ) { res.render('personas/add', { message: 'Error: El numero de radicado ya existe'}) }
    
    // throw new Error ('El local no existe') 

        await pool.query('INSERT INTO pqrsds SET ?', [newPqrsd]);
        res.redirect('/central/list')   
        
        
    }catch(err){
        res.render('personas/add', { message: err.message });
    }
})

router.get('/central/addUser', isAuthenticated, async(req,res) =>{
    
    res.render('personas/addUser', { name: req.session.name});
    
})

router.post('/central/addUser', isAuthenticated, async(req,res) => {
    try{
        const {id_usuario, nombre_usuario, telefono_usuario, correo_usuario} = req.body;
        const newPqrsd = { id_usuario, nombre_usuario, telefono_usuario, correo_usuario }        

        const [unico] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [newPqrsd.id_usuario])
        if (unico.length > 0 ) throw new Error ('Usuario ya existe')

        await pool.query('INSERT INTO usuarios SET ?', [newPqrsd]);


        res.redirect('/central/list')   
        

    }catch(err){
        // res.status(500).json({message:err.message});
        res.render('personas/AddUser', { message: err.message })
    }
})

router.get('/central/details/:id', isAuthenticated, async(req,res) =>{
    try {
        const {id} = req.params;

        const [persona] = await pool.query('SELECT id_local as local, nombre_usuario, telefono_usuario, correo_usuario, nombre_estado, nombre_local, descripcion_local FROM locales INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN estados_locales ON locales.id_estado_local = estados_locales.id_estado_local WHERE id_local = ?;', [id]);
        const personaEdit = persona[0];

        const [result] = await pool.query('SELECT id_pqrsd, pqrsds.id_local AS local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto, nombre_despachado FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado INNER JOIN despachados ON pqrsds.id_despachado = despachados.id_despachado WHERE pqrsds.id_local = ? LIMIT 50;', [id]);

        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM pqrsds WHERE id_estado = 1 AND id_local = ?;', [id])
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM pqrsds WHERE id_estado = 3 AND id_local = ?;', [id])
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];        


        res.render('personas/details', {persona: personaEdit, personas: result, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name});

    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/detailsEdit/:id',isAuthenticated, async(req,res) =>{
    const {id} = req.params;

    const [localEstado] = await pool.query('SELECT id_estado_local, nombre_estado FROM estados_locales;')
    const [persona] = await pool.query('SELECT id_local as local, locales.id_usuario, locales.id_estado_local, nombre_estado, nombre_local, descripcion_local FROM locales INNER JOIN estados_locales ON locales.id_estado_local = estados_locales.id_estado_local WHERE id_local = ?;', [id]);
    const personaEdit = persona[0];

    res.render('personas/detailsEdit', {persona: personaEdit, seleccionEstado: localEstado, /* contarEspera: cEspera, */ name: req.session.name});

})

router.post('/central/detailsEdit/:id',isAuthenticated, async(req,res) => {
    try {
        const {id} = req.params;
        const {id_estado_local, id_usuario, nombre_local, descripcion_local} = req.body;        
        const editPersona = {id_estado_local, id_usuario, nombre_local, descripcion_local};

        const [unico] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [editPersona.id_usuario])
        if (unico.length == 0 ) throw new Error ('Usuario no existe')

        await pool.query('UPDATE locales SET ? WHERE id_local = ?;', [editPersona, id]);
        
        
        res.redirect('/central/list');
    } catch (err) {
        res.status(500).json({message:err.message});
        
    }
})

router.get('/central/detailsEditUser/:id',isAuthenticated, async(req,res) =>{
    const {id} = req.params;

    const [persona] = await pool.query('SELECT id_usuario AS usuario, nombre_usuario, telefono_usuario, correo_usuario FROM usuarios WHERE id_usuario = ?;', [id]);
    const personaEdit = persona[0];

    res.render('personas/detailsEditUser', {persona: personaEdit, name: req.session.name});

})


router.post('/central/detailsEditUser/:id',isAuthenticated, async(req,res) => {
    try {
        const {id} = req.params;
        const { nombre_usuario, telefono_usuario, correo_usuario } = req.body;        
        const editPersona = { nombre_usuario, telefono_usuario, correo_usuario };

        await pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?;', [editPersona, id]);


        res.redirect('/central/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/edit/:id' , isAuthenticated, async(req,res) =>{
    try {
        const {id} = req.params;
        const [categoria] = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias;');
        const [estado] = await pool.query('SELECT id_estado, nombre_estado FROM estados;');
        const [despachado] = await pool.query('SELECT id_despachado, nombre_despachado FROM despachados;');

        const [administrador] = await pool.query('SELECT id_administrador, nombre_administrador FROM administradores WHERE id_administrador = ?;',[req.session.id_admin]);

        const [persona] = await pool.query('SELECT * FROM pqrsds INNER JOIN locales ON pqrsds.id_local = locales.id_local INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria INNER JOIN estados ON pqrsds.id_estado = estados.id_estado INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador INNER JOIN despachados ON pqrsds.id_despachado = despachados.id_despachado WHERE id_pqrsd = ?;', [id]);
        const personaEdit = persona[0];


        res.render('personas/edit', {seleccionCategoria: categoria, seleccionEstado: estado, persona: personaEdit, seleccionAdministrador: administrador, seleccionDespachado: despachado, name: req.session.name});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.post('/central/edit/:id' , isAuthenticated, async(req,res) => {
    try {
        const {id} = req.params;
        const {id_pqrsd, id_local, id_categoria, id_estado, asunto, fecha, id_administrador, id_despachado} = req.body;        
        const editPersona = {id_pqrsd, id_local, id_categoria, id_estado, asunto, fecha, id_administrador, id_despachado};
        await pool.query('UPDATE pqrsds SET ? WHERE id_pqrsd = ?;', [editPersona, id]);

        res.redirect('/central/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/delete/:id', isAuthenticated, async(req, res) =>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM pqrsds WHERE id_pqrsd = ?;', [id]);

        res.redirect('/central/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

export default router;