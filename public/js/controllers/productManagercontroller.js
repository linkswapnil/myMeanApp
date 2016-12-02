/**
 * Created by navalaks on 11/18/16.
 */
myApp.controller('productManagerController',  ['$scope', '$http', 'NgTableParams', 'productService','ngTableDefaultGetData', function ($scope, $http, NgTableParams, productService, ngTableDefaultGetData) {
    console.log("Ha Ha productManagerController");
    $scope.data = [];
    $scope.date = new Date();


    // productService.getProducts().$promise.then(function (data) {
    //     var data = [{name: "Moroni", age: 50} /*,*/];
    //     this.tableParams = new NgTableParams({}, { dataset: data});
    // })

    productService.getProducts().$promise.then(function (data) {
        $scope.data = data;
        $scope.tableParams =  new NgTableParams({
            page: 1,            // show first page
            count: 10,           // count per page,
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            counts: [5, 10, 15],
            total: 0,           // length of data
            getData: function(params) {
                var params1 = new NgTableParams(params.url()),
                    result=[];
                result = ngTableDefaultGetData($scope.data, params1);
                return result;
                // return productService.getProducts().$promise.then(function (data) {
                //     var params1 = new NgTableParams(params.url()), result=[];
                //     result = ngTableDefaultGetData(data, params1);
                //     return result;
                // });
            }
        });
    });



}]);
