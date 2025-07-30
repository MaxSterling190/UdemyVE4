import models from "../models"
import resource from '../resources'
import fs from 'fs'
import path from 'path'

export default {
    register: async (req, res) => {
        try {
            let data = req.body;
            let valid_Product = await models.Product.findOne({title: data.title});
            if (valid_Product) {
                res.status(200).json({
                    code: 403,
                    message: "EL PRODUCTO YA EXISTE"
                });
                return;
            }
            try {
                if (typeof data.tags === 'string') {
                    data.tags = JSON.parse(data.tags);
                    }
                } catch (error) {
                console.error('Error al parsear tags:', error);
                data.tags = [];
            }
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            data.price_dollars = Number(data.price_dollars);
            data.price_soles = Number(data.price_soles);
            if(req.files){
                const img_path = req.files.imagen.path;
                const pathParts = img_path.split('/');
                const portada_name = pathParts[pathParts.length - 1];
                data.portada = portada_name;
            }
            const product = await models.Product.create(data);
            res.status(200).json({
                message: "EL PRODUCTO SE REGISTRO CON EXITO",
            });

        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).send({
                message: "COURRIO UN PROBLEMA",
                error:error.message,
            });
        }   
    },
    update: async (req, res) => {
        try {
            let data = req.body;

            let valid_Product = await models.Product.findOne({title: data.title, _id: {$ne: data._id}});
            if (valid_Product) {
                res.status(200).json({
                    code: 403,
                    message: "EL PRODUCTO YA EXISTE"
                });
                return;
            }
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            if(req.files && req.files.imagen){
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.portada = portada_name;
            }
            await models.Product.findByIdAndUpdate({_id: data._id}, data);

            res.status(200).json({
                message: "EL PRODUCTO SE ACTUALIZÓ CON EXITO",
            });

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
    list: async (req, res) => {
        try {
            var search = req.query.search;
            var categorie = req.query.categorie;
            let query = {};

            if (search) {
            query.title = new RegExp(search, "i");
            }
            if (categorie) {
            query.categorie = categorie; // debe ser el _id de la categoría
            }
            let products = await models.Product.find(query).populate('categorie');
            products = products.map((product) => {
            return resource.Product.product_list(product);
            });

            res.status(200).json({
                products: products,
            });
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }   
    },
    remove: async (req, res) => {
        try {
            let _id = req.params._id;
            await models.Product.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message: "EL PRODUCTO SE ELIMINO CORRECTAMENTE",
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
    obtener_imagen: async (req, res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/product/'+img, function(err){
                if(!err){
                    let path_img = './uploads/product/'+img;
                    res.status(200).sendFile(path.resolve(path_img));
                }else{
                    let path_img = './uploads/default.jpg';
                    res.status(200).sendFile(path.resolve(path_img));
                }
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    register_imagen: async (req, res) => {
        try {
            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let product = await models.Product.findByIdAndUpdate({_id: req.body._id}, {
                $push: {
                    galerias: {
                        imagen: imagen_name,
                        _id: req.body._id
                    }
                }
            })
            res.status(500).json({
                message: "LA IMAGEN SE SUBIO PERFECTAMENTE",
                imagen: {
                    imagen: imagen_name,
                    imagen_path: 'http://localhost:3000/'+'/uploads/product/'+imagen_name,
                    _id: req.body._id
                }
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    remove_image: async (req, res) => {
        try {
            await models.Product.findByIdAndUpdate({_id: req.body._id}, {
                $pull: {
                    galerias: {
                        _id: req.body._id
                    }
                }
            });
            res.status(200).json({
                message: "LA IMAGEN SE ELIMINO PERFECTAMENTE",
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
}