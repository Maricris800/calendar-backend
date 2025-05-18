/*
    Event Routes
    /api/events
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

//Todas tienen que pasar por validación del JWT
router.use( validarJWT );

//Obtener eventos
router.get("/", getEventos) 

//Crear un nuevo evento
router.post(
    "/", 
    [
        check("title", "El título es obligatorio").not().isEmpty(),
        check("start", "La fecha de inicio es obligatoria").custom( isDate ),
        check("end", "La fecha de finalización es obligatoria").custom( isDate ), 
        validarCampos
    ], 
    crearEvento    
);

//Actualizar un evento
router.put("/:id", actualizarEvento)

//Eliminar un evento
router.delete("/:id", eliminarEvento)

module.exports = router;