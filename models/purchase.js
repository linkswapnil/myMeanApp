var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Promise = require('bluebird');
var productDAO = require('./product');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;

var purchaseAttributes = {
    purchaseId: {type: Number, required: true, unique: true},
    date: {type: Date, required: true},
    total: {type: Number},
    productList: {type: Array},
    dateModified: {type: Date},
    dateCreated: {type: Date},
    createdBy: {type: String},
    editedBy: {type: String}
};

var PurchaseSchema = new Schema(purchaseAttributes);

PurchaseSchema.plugin(autoIncrement.plugin, {model: 'Purchase', field: 'purchaseId', startAt: 100});

PurchaseSchema.pre('save', function (next) {
    var now = new Date();
    this.dateModified = now;
    if (!this.dateCreated) {
        this.dateCreated = now;
    }
    next();
});

var PurchaseModel = db.model('Purchase', PurchaseSchema);

//CREATE new Product
function createPurchase(Purchase, callbacks) {

    var f = new PurchaseModel(Purchase);

    f.save(function (err) {
        if (!err) {
            callbacks.success(f._doc);
        } else {
            callbacks.error(err);
        }
    });
}

//READ all Products
function getPurchases(callbacks) {
    return PurchaseModel.find()
        .sort('-name').exec('find', function (err, Purchases) {
            if (!err) {
                callbacks.success(Purchases);
            } else {
                callbacks.error(err);
            }
        });
}

//READ Product by id
function getPurchaseById(id, callbacks) {
    return PurchaseModel.findById(id, function (err, Product) {
        if (!err) {
            callbacks.success(Product);
        } else {
            callbacks.error(err);
        }
    });
}

function calculateDiff(oldProductList, newProductList) {
    var differences = [];

    oldProductList.forEach(function (oldProduct) {
        var present = false;
        var product = {};
        for (var i = 0; i < newProductList.length; i++) {
            if (newProductList[i].productId === oldProduct.productId && newProductList[i].unit === oldProduct.unit) {
                if (newProductList[i].qty !== oldProduct.qty)
                    newProductList[i].qty = newProductList[i].qty - oldProduct.qty;
                else
                    newProductList[i].qty = 0;
                present = true;
                product = newProductList[i];
                break;
            }
        }
        if (!present) // remove entire qty purchased
        {
            product = oldProduct;
            product.qty = -product.qty;
        }
        differences.push(product);
    });

    newProductList.forEach(function (product) {
        var added = false;
        for (var i = 0; i < differences.length; i++) {
            if (differences[i].productId === product.productId && differences[i].unit === product.unit) {
                added = true;
                break;
            }
        }
        if (!added) {
            differences.push(product);
        }
    });

    return differences;
}

//UPDATE Product
function updatePurchase(id, Purchase, callbacks) {
    return PurchaseModel.findById(id, function (err, f) {
        if (!err) {
            var PromiseObj = Promise.defer();
            var oldProductList = f.productList;
            var newProductList = Purchase.productList;
            var differenceOfStock = calculateDiff(oldProductList, JSON.parse(JSON.stringify(newProductList)));
            var promises = [];

            differenceOfStock.forEach(function (product) {
                var promise = productDAO.updateInStockQty(product.productId, product.unit, product.qty, {
                    success: function (msg) {
                        console.log('Success', msg);
                    },
                    error: function () {
                        PromiseObj.reject(callbacks.error(err));
                    }
                });
                promises.push(promise);
            });

            Promise.all(promises).then(function () {
                f.date = Purchase.date;
                f.total = Purchase.total;
                f.productList = Purchase.productList;
                f.editedBy = Purchase.editedBy;
                f.save(function (err) {
                    if (!err) {
                        PromiseObj.resolve(callbacks.success(f._doc));
                    } else {
                        PromiseObj.reject(callbacks.error(err));
                    }
                });
            });

            return PromiseObj;
        }
    });
}

//DELETE Product
function deletePurchase(id, callbacks) {
    return PurchaseModel.findById(id, function (err, f) {
        var differenceOfStock = f.productList;
        var PromiseObj = Promise.defer();
        var promises = [];

        differenceOfStock.forEach(function (product) {
            var promise = productDAO.updateInStockQty(product.productId, product.unit, -product.qty, {
                success: function (msg) {
                    console.log('Success', msg);
                },
                error: function () {
                    PromiseObj.reject(callbacks.error(err));
                }
            });
            promises.push(promise);
        });

        Promise.all(promises).then(function () {
            f.remove(function (err) {
                if (!err) {
                    PromiseObj.resolve(callbacks.success(f._doc));
                } else {
                    PromiseObj.reject(callbacks.error(err));
                }
            });
        });
    });
}


module.exports.createPurchase = createPurchase;
module.exports.getPurchases = getPurchases;
module.exports.updatePurchase = updatePurchase;
module.exports.deletePurchase = deletePurchase;
