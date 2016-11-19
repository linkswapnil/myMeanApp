var mongoose = require('mongoose');

function _init(){
    try{
        return mongoose.createConnection('mongodb://localhost/supershop');
        //return mongoose.createConnection('mongodb://han_solo:chewbacca@ds011419.mlab.com:11419/mean-boilerplate-test');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;
