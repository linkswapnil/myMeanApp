var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productId:      { type: Number, required: true, unique: true },
    name:           { type: String, required: true},
    retailPrice:    { type: Number, required: true },
    wholeSaleprice: { type: Number, required: true },
    inStock:        { type: Number },
    firm:           { type: String, required: true },
    iconURL :       { type: String },
    brandName:      { type: String },
    mrp:            { type: Number },
    tax:            { type: Number },
    dateCreated:    { type: Date },
    dateModified:   { type: Date },
    createdBy:      { type: String }
});

ProductSchema.index({ name: 1, brandName: 1}, { unique: true });

var IconsSchema = new Schema({
    iconId:      { type: Number, required: true, unique: true },
    imageData :    { type: String }
});

IconsSchema.plugin(autoIncrement.plugin, { model: 'Icons', field: 'iconId',  startAt: 1 });

IconsSchema.set('validateBeforeSave', false);

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'productId',  startAt: 100 });

ProductSchema.pre('save', function(next){
    var now = new Date();
    this.dateModified = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

var ProductModel = db.model('Product', ProductSchema);

var IconsModel = db.model('Icons', IconsSchema);

//CREATE new Product
function createProduct(Product, callbacks){
    var f = new ProductModel({
        name:           Product.name,
        retailPrice:    Product.retailPrice,
        wholeSaleprice: Product.wholeSaleprice,
        inStock:        Product.inStock,
        firm:           Product.firm,
        brandName:      Product.brandName,
        mrp:            Product.mrp,
        tax:            Product.tax,
        iconURL:        Product.iconURL,
        createdBy:      Product.createdBy
    });

    f.save(function (err) {
        if (!err) {
            callbacks.success(f._doc);
        } else {
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
            f.name = Product.name;
            f.retailPrice = Product.retailPrice;
            f.wholeSaleprice = Product.wholeSaleprice;
            f.inStock = Product.inStock;
            f.firm = Product.firm;
            f.brandName = Product.brandName;
            f.mrp = Product.mrp;
            f.tax = Product.tax;
            f.iconURL = Product.iconURL;
            f.createdBy = Product.createdBy;
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
                    callbacks.success(f._doc);
                } else {
                    callbacks.error(err);
                }
            });
        } else {
            callbacks.error(err);
        }
    });
}

//READ Product by id
function getIconById(id, callbacks){
    return IconsModel.find({ iconId : id}, function (err, icon) {
        if (!err) {
            callbacks.success(icon);
        } else {
            callbacks.error(err);
        }
    });
}

function saveProductIcon(data, callbacks) {

    var record = new IconsModel({
        imageData : data.data
    });

    record.save(function (err) {
        if (!err) {
            //if(!isInTest) console.log("[ADD]   Product created with id: " + f._id);
            callbacks.success(record);
        } else {
            console.log(err);
            callbacks.error(err);
        }
    });

}

module.exports.createProduct = createProduct;
module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.saveProductIcon = saveProductIcon;
module.exports.getIconById = getIconById;
