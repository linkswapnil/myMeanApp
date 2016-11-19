var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name:           { type: String, required: true, unique: true },
    description:    { type: String, required: true },
    price:          { type: Number, required: true },
    dateCreated:    { type: Date },
    dateModified:   { type: Date },
    openingBalance: { type: Number }
});

ProductSchema.pre('save', function(next){
    now = new Date();
    this.dateModified = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

var ProductModel = db.model('Fruit', ProductSchema);

//CREATE new Product
function createProduct(Product, callbacks){
    var f = new ProductModel({
        name:           Product.name,
        description:    Product.description,
        price:          Product.price,
        openingBalance : Product.openingBalance
    });

    f.save(function (err) {
        if (!err) {
            //if(!isInTest) console.log("[ADD]   Product created with id: " + f._id);
            callbacks.success(f);
        } else {
            //if(!isInTest) console.log(err);
            callbacks.error(err);
        }
    });
}

//READ all Products
function getProducts(callbacks){
    return ProductModel.find()
        .sort('-name').exec('find', function (err, Products) {
            if (!err) {
                callbacks.success(Products);
            } else {
                callbacks.error(err);
            }
        });
}

//READ Product by id
function getProductById(id, callbacks){
    return ProductModel.findById(id, function (err, Product) {
        if (!err) {
            callbacks.success(Product);
        } else {
            callbacks.error(err);
        }
    });
}

//UPDATE Product
function updateProduct(id, Product, callbacks){
    return ProductModel.findById(id, function (err, f) {
        if (!err) {
            if (Product.name) f.name = Product.name;
            if (Product.description) f.description = Product.description;
            if (Product.price) f.price = Product.price;

            return f.save(function (err) {
                if (!err) {
                    callbacks.success(f);
                } else {
                    callbacks.error(err);
                }
            });
        }
    });
}

//DELETE Product
function deleteProduct(id, callbacks){
    return ProductModel.findById(id, function (err, f) {
        if (!err) {
            return f.remove(function (err) {
                if (!err) {
                    callbacks.success(f);
                } else {
                    callbacks.error(err);
                }
            });
        } else {
            callbacks.error(err);
        }
    });
}

module.exports.createProduct = createProduct;
module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
