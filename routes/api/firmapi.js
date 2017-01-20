/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    fs = require('fs'),
    router = express.Router(),
    firmDAO = require('../../models/firm'),
    multer = require('multer'),
    upload = multer({dest: '../public/images/uploads/'});
path = require('path');

//CREATE a new product
router.post('/', function (req, res) {
    firmDAO.createFirm({
        name: req.body.name,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        iconURL: req.body.iconURL,
        tinNumber: req.body.tinNumber,
        createdBy: req.user.username,
        editedBy: req.user.username
    }, {
        success: function (f) {
            res.status(201).send({message: 'Firm ' + f.name + ' code: ' + f.firmId + ' created successfully', data: f});
        },
        error: function (err) {
            if (err.code === 11000) {
                res.status(500).send({
                    "message": "Firm already added!"
                });
            } else {
                console.log(err);
                res.status(500).send({message: "Failed to create Firm"});
            }
        }
    });
});

router.get('/upload', function (req, res) {
    res.render('imageUpload');
});

// File input field name is simply 'file'
router.post('/upload', upload.single('file'), function (req, res) {
    var file = path.resolve(req.file.destination) + '/' + req.file.filename;
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.json({
                message: 'File uploaded successfully',
                filename: req.file.filename
            });
        }
    });
});

//READ all products
router.get('/', function (req, res) {
    firmDAO.getFirms({
        success: function (firms) {
            res.status(200).send(JSON.stringify(firms));
        },
        error: function (err) {
            res.status(500).send(err);
        }
    });
});

//UPDATE product
router.put('/:id', function (req, res) {
    firmDAO.updateFirm(req.params.id,
        {
            name: req.body.name,
            address: req.body.address,
            contactNumber: req.body.contactNumber,
            iconURL: req.body.iconURL,
            tinNumber: req.body.tinNumber,
            editedBy: req.user.username
        },
        {
            success: function (f) {
                res.status(201).send({
                    message: 'Firm ' + f.name + ' code: ' + f.productId + ' edited successfully',
                    data: f
                });
            },
            error: function (err) {
                if (err.code === 11000) {
                    res.status(500).send({
                        "message": "Firm already added!"
                    });
                } else {
                    console.log(err);
                    res.status(500).send({message: "Failed to create Firm"});
                }
            }
        }
    );
});

//DELETE product
router.delete('/:id', function (req, res) {
    firmDAO.deleteFirm(req.params.id, {
        success: function (f) {
            res.status(200).send({message: 'Firm ' + f.name + " deleted successfully", data: f});
        },
        error: function (err) {
            res.status(500).send({message: 'Failed deleting firm'});
        }
    });
});

module.exports = router;
