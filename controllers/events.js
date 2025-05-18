const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async(req, res = response ) => {

    const eventos = await Evento.find().populate("user", "name");  //populate para obtener el nombre del usuario que creó el evento

    res.json({
        ok: true,
        eventos
    });
}

const crearEvento = async(req, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid; //uid viene del middleware validarJWT

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Error al guardar el evento. Hable con el administrador",
        });
    }   
    
}

const actualizarEvento = async(req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no encontrado por id",
            });
        }

        if ( evento.user !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegios para editar este evento",                
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado,
        });

    } catch ( error ) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: "Error al actualizar el evento. Hable con el administrador",
        });

    }    
}

const eliminarEvento = async(req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no encontrado por id",
            });
        }

        if ( evento.user !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: "No tiene privilegios para eliminar este evento",                
            });
        }        

        await Evento.findByIdAndDelete( eventoId);

        res.json({ ok: true });

    } catch ( error ) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });

    }    

    res.json({
        ok: true,
        msg: "eliminarEvento",
    });
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}