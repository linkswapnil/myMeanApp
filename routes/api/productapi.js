/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    router = express.Router(),
    productDAO = require('../../models/product');

//CREATE a new product
router.post('/', function (req, res){
    productDAO.createProduct({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            openingBalance : req.body.openingBalance
        }, {
            success: function(f){
                res.status(201).send({msg: 'Product created succesfully: '+req.body.name, data: f});
            },
            error: function(err){
                if(err.code === 11000){
                    res.status(500).send({
                        "message" : "Product name already present !"
                    });
                }else{
                    res.status(500).send(err);
                }
            }
        });
});

//READ all products
router.get('/', function(req, res, next) {
    productDAO.getProducts({
            success: function(products){
                res.status(200).send(JSON.stringify(products));
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
});

//READ product by id
router.get('/:id', function (req, res){
    productDAO.getProductById(req.params.id ,{
            success: function(product){
                res.status(200).send(JSON.stringify(product));
            },
            error: function(err){
                res.status(404).send(err);
            }
        });
});

//UPDATE product
router.put('/:id', function (req, res){
    productDAO.updateProduct(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            openingBalance : req.body.openingBalance
        }, {
            success: function(f){
                res.status(200).send({msg: 'Product updated succesfully: '+JSON.stringify(f), data: f});
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
});

//DELETE product
router.delete('/:id', function (req, res){
        productDAO.deleteProduct(req.params.id ,{
            success: function(f){
                res.status(200).send({msg: 'Product deleted succesfully: ' + req.params.id, data: f});
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
});

module.exports = router;
