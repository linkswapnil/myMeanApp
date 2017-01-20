var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;

var firmAttributes = {
    firmId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    address: {type: String},
    contactNumber: {type: Number},
    tinNumber: {type: String},
    dateModified: {type: Date},
    iconURL: {type: String},
    createdBy: {type: String},
    editedBy: {type: String}
};

var FirmSchema = new Schema(firmAttributes);

FirmSchema.plugin(autoIncrement.plugin, {model: 'Firm', field: 'firmId', startAt: 100});

FirmSchema.pre('save', function (next) {
    var now = new Date();
    this.dateModified = now;
    if (!this.dateCreated) {
        this.dateCreated = now;
    }
    next();
});

var FirmModel = db.model('Firm', FirmSchema);

//CREATE new Product
function createFirm(Firm, callbacks) {

    var f = new FirmModel(Firm);

    f.save(function (err) {
        if (!err) {
            callbacks.success(f._doc);
        } else {
            callbacks.error(err);
        }
    });
}

//READ all Products
function getFirms(callbacks) {
    return FirmModel.find()
        .sort('-name').exec('find', function (err, Firms) {
            if (!err) {
                callbacks.success(Firms);
            } else {
                callbacks.error(err);
            }
        });
}

//READ Product by id
function getFirmById(id, callbacks) {
    return FirmModel.findById(id, function (err, Product) {
        if (!err) {
            callbacks.success(Product);
        } else {
            callbacks.error(err);
        }
    });
}

//UPDATE Product
function updateFirm(id, Firm, callbacks) {
    return FirmModel.findById(id, function (err, f) {
        if (!err) {
            f.name = Firm.name;
            f.iconURL = Firm.iconURL;
            f.address = Firm.address;
            f.contactNumber = Firm.contactNumber;
            f.tinNumber = Firm.tinNumber;
            f.editedBy = Firm.createdBy;
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
function deleteFirm(id, callbacks) {
    return FirmModel.findById(id, function (err, f) {
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


module.exports.createFirm = createFirm;
module.exports.getFirms = getFirms;
module.exports.updateFirm = updateFirm;
module.exports.deleteFirm = deleteFirm;
