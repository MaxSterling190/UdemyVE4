import models from '../models';

export default {
    register: async (req, res) => {
        try {
            let data = req.body;
            let variedad = await models.Variedad.create(data);
            res.status(200).json({
                variedad: variedad,
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async (req, res) => {
        try {
            let data = req.body;
            let variedad = await models.Variedad.findByIdAndUpdate({_id:data._id},data);
            res.status(200).json({
                variedad: variedad,
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            let _id = req.params.id;
            await models.Variedad.findByIdAndUpdate({_id:_id});
            res.status(200).json({
                message: "SE ELIMINO LA VARIEDAD",
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
}