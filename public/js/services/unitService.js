/**
 * Created by navalaks on 1/10/17.
 */

myApp.service('unitService', function () {
    var units = ['kg','liter','gram','ml','piece', 'other'];

    this.getStandardUnits = function () {
        return units;
    }
});
