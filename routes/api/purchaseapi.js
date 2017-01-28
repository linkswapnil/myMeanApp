/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    router = express.Router(),
    purchaseDAO = require('../../models/purchase'),
    productDAO = require('../../models/product'),
    //Promise = require('mpromise'),
    Promise = require('bluebird'),
    path = require('path');

//CREATE a new purchase
router.post('/', function (req, res) {
    purchaseDAO.createPurchase({
        date: req.body.date,
        total: req.body.total,
        productList: req.body.productList,
        createdBy: req.user.username,
        editedBy: req.user.username
    }, {
        success: function (f) {
            var promises = [];

            req.body.productList.forEach(function (product) {
                var promise = productDAO.updateInStockQty(product.productId, product.unit, product.qty, {
                    success: function (msg) {
                        console.log('Success', msg);
                    },
                    error: function failed() {
                        res.status(500).send({message: "Failed to update Stock"});
                    }
                });
                promises.push(promise);
            });

            Promise.all(promises).then(function () {
                res.status(201).send({message: 'Purchase record code: ' + f.purchaseId + ' created and stock details updated successfully'});
            });

        },
        error: function (err) {
            if (err.code === 11000) {
                res.status(500).send({
                    "message": "Purchase already added!"
                });
            } else {
                console.log(err);
                res.status(500).send({message: "Failed to create Purchase"});
            }
        }
    });
});

//READ all products
router.get('/', function (req, res) {
    purchaseDAO.getPurchases({
        success: function (purchases) {
            res.status(200).send(JSON.stringify(purchases));
        },
        error: function (err) {
            res.status(500).send(err);
        }
    });
});

//UPDATE product
router.put('/:id', function (req, res) {
    purchaseDAO.updatePurchase(req.params.id,
        {
            date: req.body.date,
            total: req.body.total,
            productList: req.body.productList,
            editedBy: req.user.username
        },
        {
            success: function (f) {
                res.status(201).send({
                    message: 'Purchase code: ' + f.purchaseId + ' edited and stock details updated successfully',
                    data: f
                });
            },
            error: function (err) {
                if (err.code === 11000) {
                    res.status(500).send({
                        "message": "Purchase already added!"
                    });
                } else {
                    console.log(err);
                    res.status(500).send({message: "Failed to create Purchase"});
                }
            }
        }
    );
});

//DELETE product
router.delete('/:id', function (req, res) {
    purchaseDAO.deletePurchase(req.params.id, {
        success: function (f) {
            res.status(200).send({
                message: 'Purchase ' + f.purchaseId + " deleted and stock details updated successfully",
                data: f
            });
        },
        error: function (err) {
            res.status(500).send({message: 'Failed deleting purchase'});
        }
    });
});

module.exports = router;
