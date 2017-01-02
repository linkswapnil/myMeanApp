/**
 * Created by navalaks on 11/18/16.
 */
myApp.controller('productManagerController',  ['$scope', '$http', 'NgTableParams', 'productService','ngTableDefaultGetData','$uibModal', function ($scope, $http, NgTableParams, productService, ngTableDefaultGetData, $uibModal) {
    $scope.data = [];
    $scope.date = new Date();


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
            }
        });
    });

    $scope.addProduct = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/templates/addProduct.html',
            controller: 'addProductController',
            resolve: {
                items: function () {
                    return $scope.data;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);


myApp.controller('addProductController',['$scope', function () {

}]);

