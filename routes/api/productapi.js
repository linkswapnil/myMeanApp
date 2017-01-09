/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    fs = require('fs'),
    router = express.Router(),
    productDAO = require('../../models/product'),
    multer  = require('multer'),
    upload = multer({ dest: '../public/images/uploads/' });
    path = require('path');

//CREATE a new product
router.post('/', function (req, res){
    productDAO.createProduct({
            name: req.body.name,
            retailPrice: req.body.retailPrice,
            wholeSaleprice: req.body.wholeSaleprice,
            inStock : req.body.inStock,
            firm : req.body.firm,
            brandName: req.body.brandName,
            mrp : req.body.mrp,
            tax: req.body.tax,
            iconURL: req.body.iconURL,
            createdBy: req.user.username
        }, {
            success: function(f){
                res.status(201).send({message: 'Product '+ f.name + ' code: ' + f.productId +' created successfully', data: f});
            },
            error: function(err){
                if(err.code === 11000){
                    res.status(500).send({
                        "message" : "Product already added!"
                    });
                }else{
                    console.log(err);
                    res.status(500).send({message : "Failed to create Product"});
                }
            }
        });
});

router.get('/geticon/:id', function (req, res){
    productDAO.getIconById(req.params.id ,{
        success: function(iconData){
            var base64Image = new Buffer(iconData[0].imageData, 'binary').toString('base64');
            res.status(200).send('<img src="data:image/png;base64,' + base64Image + '>');
        },
        error: function(err){
            res.status(404).send(err);
        }
    });
});

router.get('/upload', function(req, res) {
    res.render('imageUpload');
});

// File input field name is simply 'file'
router.post('/upload', upload.single('file'), function(req, res) {
    var file = path.resolve(req.file.destination) + '/' + req.file.filename;
    fs.rename(req.file.path, file, function(err) {
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

router.post('/uploadicon', function (req, res){
    var body = '';
    var header = '';
    var content_type = req.headers['content-type'];
    var boundary = content_type.split('; ')[1].split('=')[1];
    var headerFlag = true;
    var filename = 'dummy.bin';
    var filenameRegexp = /filename="(.*)"/m;

    req.on('data', function(raw) {
        console.log('received data length: ' + raw.length);
        var i = 0;
        while (i < raw.length)
            if (headerFlag) {
                var chars = raw.slice(i, i+4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i+4).toString();
                    console.log('header length: ' + header.length);
                    console.log('header: ');
                    console.log(header);
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                    console.log('filename: ' + filename);
                    console.log('header done');
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
                console.log('actual file size: ' + body.length);
            }
    });

    req.on('end', function() {
        // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
        body = body.slice(0, body.length - (boundary.length + 8));
        console.log('body: ' + body);
        console.log('final file size: ' + body.length);
        //fs.writeFileSync('files/' + filename, body, 'binary');
        console.log('done');
        productDAO.saveProductIcon({
            data : body
        },{
            success: function(f){
                res.status(201).send({msg: 'Icon uploaded succesfully:'});
            },
            error: function(err){
                if(err){
                    res.status(500).send({
                        "message" : "Error uploading Image !"
                    });
                }else{
                    res.status(500).send(err);
                }
            }
        });
    })

});

//READ all products
router.get('/', function(req, res) {
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
    productDAO.updateProduct(req.params.id,
            {
                name: req.body.name,
                retailPrice: req.body.retailPrice,
                wholeSaleprice: req.body.wholeSaleprice,
                inStock : req.body.inStock,
                firm : req.body.firm,
                brandName: req.body.brandName,
                mrp : req.body.mrp,
                tax: req.body.tax,
                iconURL: req.body.iconURL,
                createdBy: req.user.username
            },
            {
            success: function(f){
                res.status(201).send({message: 'Product '+ f.name + ' code: ' + f.productId +' edited successfully', data: f});
            },
            error: function(err){
                if(err.code === 11000){
                    res.status(500).send({
                        "message" : "Product already added!"
                    });
                }else{
                    console.log(err);
                    res.status(500).send({message : "Failed to create Product"});
                }
            }
            }
    );
});

//DELETE product
router.delete('/:id', function (req, res){
        productDAO.deleteProduct(req.params.id ,{
            success: function(f){
                res.status(200).send({message: 'Product ' + f.name + ' of brand '+ f.brandName + " deleted successfully" , data: f});
            },
            error: function(err){
                res.status(500).send({message: 'Failed deleting product'});
            }
        });
});

module.exports = router;
