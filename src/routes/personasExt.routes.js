import { Router } from "express";
import pool from "../database.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

router.get('/central/listExt', isAuthenticated, async(req, res) =>{
    try{              
        
        const [resultTotal] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC LIMIT 50;');

        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM externo WHERE id_estado = 3;')
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];        
        
        res.render('personasExt/listExt', {personas: resultTotal, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name })
    }catch(err){
        res.status(500).json({message:err.message});
        

    }
})

router.get('/central/notifyExt', isAuthenticated, async(req,res) =>{
    try {

        const [resultTotal] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto, nombre_despachado FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado INNER JOIN despachados ON externo.id_despachado = despachados.id_despachado WHERE externo.id_estado = 1 ORDER BY fecha DESC;');

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

            res.render('personasExt/pendingExt', {personas: resultTotal1, name: req.session.name })

    } catch (err) {
        res.status(500).json({message:err.message});

    }
})

router.post('/central/list-searchExt', isAuthenticated, async(req, res) => {
    try {

        const search = req.body.search       
        
        const [resultSearch] = await pool.query(`SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado WHERE nombre_empresa LIKE '%' ? '%' ORDER BY fecha DESC;`, [search]);

        res.render('personasExt/searchExt', {personas: resultSearch, busqueda: search, name: req.session.name /* contarPendiente: cPendiente, contarEspera: cEspera */})           

    } catch (err) {
        res.status(500).json({message:err.message});
        // res.render('personas/list', { message: err.message })
    }
})

router.get('/central/list-catExt/:id', isAuthenticated, async(req, res) => {  
    try{   

        const {id} = req.params;

        const [resultTotal] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado WHERE externo.id_estado = ? ORDER BY fecha DESC;', [id]);   

        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM externo WHERE id_estado = 3;')
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];
        res.render('personasExt/listExt', {personas: resultTotal, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name})

    }catch(err){
        res.status(500).json({message:err.message});
    }

})

router.get('/central/list-pageExt', isAuthenticated, async(req, res) => {
    
    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
    // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM externo WHERE id_estado = 3;')
    const cPendiente = contarPendiente[0];
    // const cEspera = contarEspera[0];

    const {page, limit} = req.query
    const offset = (page - 1) * limit
    const [data] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC limit ? offset ?', [+limit, +offset])
    const [totalPageData] = await pool.query ('SELECT COUNT(*) AS count FROM externo')
    const totalPage = Math.ceil(+totalPageData[0]?.count / limit)
    //Probando
    // console.log(totalPage)
    res.render('personasExt/listExt', {personas: data, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name})

})


router.get('/central/list-pageExt-2', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 50')
    
    res.render('personasExt/listExt', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-pageExt-3', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 100')
    
    res.render('personasExt/listExt', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-pageExt-4', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 150')
    
    res.render('personasExt/listExt', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})
router.get('/central/list-pageExt-5', isAuthenticated, async(req, res) => {

    const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1;')
    const cPendiente = contarPendiente[0];

    const [data] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado ORDER BY fecha DESC limit 50 offset 200')
    
    res.render('personasExt/listExt', {personas: data, contarPendiente: cPendiente, name: req.session.name})

})

router.get('/central/addExt', isAuthenticated, async(req,res) =>{
    const [categoria] = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias;');
    const [estado] = await pool.query('SELECT id_estado, nombre_estado FROM estados;');
    const [despachado] = await pool.query('SELECT id_despachado, nombre_despachado FROM despachados;');
    const [administrador] = await pool.query('SELECT id_administrador, nombre_administrador FROM administradores WHERE id_administrador = ?;', [req.session.id_admin]);
    const [empresa] = await pool.query('SELECT id_empresa, nombre_empresa FROM empresas;');
    res.render('personasExt/addExt', {seleccionCategoria: categoria, seleccionEstado: estado, seleccionAdministrador: administrador, seleccionEmpresa: empresa, seleccionDespachado: despachado, name: req.session.name});
    
})

router.post('/central/addExt', async(req,res) => {
    try{
        const {id_externo, id_empresa, id_categoria, id_estado,  asunto, fecha, id_administrador, id_despachado} = req.body;
        const newPqrsd = { id_externo, id_empresa, id_categoria, id_estado,  asunto, fecha, id_administrador, id_despachado }        
        await pool.query('INSERT INTO externo SET ?', [newPqrsd]);
        res.redirect('/central/listExt')   
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/central/addUserExt', isAuthenticated, async(req,res) =>{
    
    res.render('personasExt/addUserExt', { name: req.session.name });
    
})

router.post('/central/addUserExt', async(req,res) => {
    try{
        const { nombre_empresa, descripcion_empresa, telefono_empresa, correo_empresa } = req.body;
        const newPqrsd = { nombre_empresa, descripcion_empresa, telefono_empresa, correo_empresa }        

        await pool.query('INSERT INTO empresas SET ?', [newPqrsd]);
        res.redirect('/central/listExt')   
        

    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/central/detailsExt/:id', isAuthenticated, async(req,res) =>{
    try {
        const {id} = req.params;

        const [persona] = await pool.query('SELECT id_empresa as empresa, nombre_empresa, descripcion_empresa, telefono_empresa, correo_empresa FROM empresas WHERE id_empresa = ?;', [id]);
        const personaEdit = persona[0];

        const [result] = await pool.query('SELECT id_externo, externo.id_empresa AS empresa, nombre_empresa, nombre_administrador, nombre_categoria, nombre_estado, fecha, asunto, nombre_despachado FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado INNER JOIN despachados ON externo.id_despachado = despachados.id_despachado WHERE externo.id_empresa = ? LIMIT 50;', [id]);

        const [contarPendiente] = await pool.query('SELECT COUNT(*) AS pendiente FROM externo WHERE id_estado = 1 AND id_empresa = ?;', [id])
        // const [contarEspera] = await pool.query('SELECT COUNT(*) AS espera FROM externo WHERE id_estado = 3 AND id_empresa = ?;', [id])
        const cPendiente = contarPendiente[0];
        // const cEspera = contarEspera[0];        


        res.render('personasExt/detailsExt', {persona: personaEdit, personas: result, contarPendiente: cPendiente, /* contarEspera: cEspera, */ name: req.session.name});

    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/detailsEditUserExt/:id',isAuthenticated, async(req,res) =>{
    const {id} = req.params;

    const [empresa] = await pool.query('SELECT id_empresa, nombre_empresa FROM empresas;');
    const [persona] = await pool.query('SELECT id_empresa AS empresa, nombre_empresa, telefono_empresa, correo_empresa, descripcion_empresa FROM empresas WHERE id_empresa = ?;', [id]);
    const personaEdit = persona[0];

    res.render('personasExt/detailsEditUserExt', {persona: personaEdit, seleccionEmpresa:empresa, name: req.session.name});

})


router.post('/central/detailsEditUserExt/:id',isAuthenticated, async(req,res) => {
    try {
        const {id} = req.params;
        const { telefono_empresa, correo_empresa, descripcion_empresa } = req.body;        
        const editPersona = { telefono_empresa, correo_empresa, descripcion_empresa };
        await pool.query('UPDATE empresas SET ? WHERE id_empresa = ?;', [editPersona, id]);


        res.redirect('/central/listExt');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/editExt/:id' , isAuthenticated, async(req,res) =>{
    try {
        const {id} = req.params;
        const [categoria] = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias;');
        const [estado] = await pool.query('SELECT id_estado, nombre_estado FROM estados;');
        const [despachado] = await pool.query('SELECT id_despachado, nombre_despachado FROM despachados;');
        const [administrador] = await pool.query('SELECT id_administrador, nombre_administrador FROM administradores WHERE id_administrador = ?;',[req.session.id_admin]);
        const [empresa] = await pool.query('SELECT id_empresa, nombre_empresa FROM empresas;');

        const [persona] = await pool.query('SELECT * FROM externo INNER JOIN empresas ON externo.id_empresa = empresas.id_empresa INNER JOIN categorias ON externo.id_categoria = categorias.id_categoria INNER JOIN estados ON externo.id_estado = estados.id_estado INNER JOIN administradores ON externo.id_administrador = administradores.id_administrador INNER JOIN despachados ON externo.id_despachado = despachados.id_despachado WHERE id_externo = ?;', [id]);
        const personaEdit = persona[0];


        res.render('personasExt/editExt', {seleccionCategoria: categoria, seleccionEstado: estado, persona: personaEdit, seleccionAdministrador: administrador, seleccionEmpresa: empresa, seleccionDespachado: despachado, name: req.session.name });
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.post('/central/editExt/:id' , async(req,res) => {
    try {
        const {id} = req.params;
        const {id_externo, id_empresa, id_categoria, id_estado, asunto, fecha, id_administrador, id_despachado} = req.body;        
        const editPersona = {id_externo, id_empresa, id_categoria, id_estado, asunto, fecha, id_administrador, id_despachado};
        await pool.query('UPDATE externo SET ? WHERE id_externo = ?;', [editPersona, id]);

        res.redirect('/central/listExt');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/central/deleteExt/:id', isAuthenticated, async(req, res) =>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM externo WHERE id_externo = ?;', [id]);

        res.redirect('/central/listExt');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

export default router;