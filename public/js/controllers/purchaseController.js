/**
 * Created by navalaks on 1/20/17.
 */
myApp.controller('purchaseController', ['$scope', 'NgTableParams', 'purchaseService', 'ngTableDefaultGetData', '$uibModal', function ($scope, NgTableParams, purchaseService, ngTableDefaultGetData, $uibModal) {

    $scope.purchaseData = [];
    $scope.feedback = {};
    $scope.feedback.visible = false;

    function initTable() {
        purchaseService.getPurchases().$promise.then(function (data) {
            $scope.purchaseData = data;
            $scope.tableParams = new NgTableParams({
                page: 1,            // show first page
                count: 10,           // count per page,
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                counts: [5, 10, 15],
                total: data.length,           // length of data
                getData: function (params) {
                    var params1 = new NgTableParams(params.url()),
                        result = [];
                    result = ngTableDefaultGetData($scope.purchaseData, params1);
                    return result;
                }
            });
        });
    }

    initTable();

    $scope.hideFeedBack = function () {
        $scope.feedback.visible = false;
    };

    $scope.deletePurchase = function (id) {
        purchaseService.deletePurchase({id: id}).$promise.then(function (res) {
            $scope.feedback.icon = 'check';
            $scope.feedback.visible = true;
            $scope.feedback.status = 'success';
            $scope.feedback.message = res.message;
            initTable();
        }, function (res) {
            $scope.feedback.icon = 'close';
            $scope.feedback.visible = true;
            $scope.feedback.status = 'danger';
            $scope.feedback.message = res.message;
        });
    };

    $scope.editPurchase = function (purchase) {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/purchase/editPurchase.html',
            controller: 'editPurchaseController',
            windowClass: 'app-modal-window',
            resolve: {
                purchase: function () {
                    return purchase;
                }
            }
        });

        modalInstance.result.then(function (response) {
            $scope.feedback.message = response.message;

            if (response.status === 'success') {
                $scope.feedback.icon = 'check';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'success';
                initTable();
            } else {
                $scope.feedback.icon = 'close';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'danger';
            }
        });
    };

    $scope.addPurchase = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/purchase/addPurchase.html',
            controller: 'addPurchaseController',
            windowClass: 'app-modal-window'
        });

        modalInstance.result.then(function (response) {
            $scope.feedback.message = response.message;

            if (response.status === 'success') {
                $scope.feedback.icon = 'check';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'success';
                initTable();
            } else {
                $scope.feedback.icon = 'close';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'danger';
            }
        });
    };

}]);


myApp.controller('editPurchaseController', ['$scope', '$uibModalInstance', 'purchase', 'purchaseService', 'productService', function ($scope, $uibModalInstance, purchase, purchaseService, productService) {

    $scope.model = {};

    var products = [];

    var keys = Object.keys(purchase);

    keys.forEach(function (key) {
        $scope.model[key] = purchase[key];
    });

    productService.getProducts().$promise.then(function (data) {
        $scope.products = data;
        products = data;
        setSelected();
    });

    function setSelected() {
        $scope.model.productList.forEach(function (prod) {
            products.some(function (product) {
                if (prod.productId === product._id) {
                    prod.product = product;
                    prod.availableUnits = getAvailableUnits(product.priceList);
                    return true;
                }
            });
        })
    };

    $scope.addProduct = function () {
        $scope.model.productList.push({rate: 0, qty: 0, total: 0});
    };

    $scope.getTotal = function () {
        var total = 0;
        $scope.model.productList.forEach(function (product) {
            total = total + ((Number(product.qty) || 0) * (Number(product.rate) || 0));
        });
        return total;
    };

    $scope.removeProduct = function (index) {
        $scope.model.productList.splice(index, 1);
    };

    $scope.displayUnits = function (item, model, index) {
        if (!$scope.model.productList[index].availableUnits) {
            $scope.model.productList[index].availableUnits = getAvailableUnits(item.priceList);
        }
    };

    $scope.editPurchase = function () {

        var productListData = getProductData($scope.model.productList);

        var data = {
            date: $scope.model.date,
            total: $scope.getTotal(),
            id: purchase._id,
            productList: productListData
        };

        purchaseService.editPurchase({id: purchase._id}, data).$promise.then(function (res) {
            res.status = "success";
            $uibModalInstance.close(res);
        }, function (res) {
            res.status = "failed";
            res.message = res.data.message;
            $uibModalInstance.close(res); //failed
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

function getAvailableUnits(priceList) {
    var units = [];

    priceList.forEach(function (price) {
        if (price.unit === 'other') {
            units.push(price.unitName);
        } else {
            units.push(price.unit);
        }
    });

    return units;
}

myApp.controller('addPurchaseController', ['$scope', '$uibModalInstance', 'purchaseService', 'productService', function ($scope, $uibModalInstance, purchaseService, productService) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    productService.getProducts().$promise.then(function (data) {
        $scope.products = data;
    });

    $scope.productList = [{rate: 0, qty: 0, total: 0}];

    $scope.addProduct = function () {
        $scope.productList.push({rate: 0, qty: 0, total: 0});
    };

    $scope.removeProduct = function (index) {
        $scope.productList.splice(index, 1);
    };


    $scope.getTotal = function () {
        var total = 0;
        $scope.productList.forEach(function (product) {
            total = total + ((Number(product.qty) || 0) * (Number(product.rate) || 0));
        });
        return total;
    };

    $scope.displayUnits = function (item, model, index) {
        if (!$scope.productList[index].availableUnits) {
            $scope.productList[index].availableUnits = getAvailableUnits(item.priceList);
        }
    };

    $scope.savePurchase = function () {

        var productListData = getProductData($scope.productList);

        var data = {
            date: $scope.purchaseDate,
            total: $scope.getTotal(),
            productList: productListData
        };

        purchaseService.addPurchase(data).$promise.then(function (res) {
            res.status = "success";
            $uibModalInstance.close(res);
        }, function (res) {
            res.status = "failed";
            res.message = res.data.message;
            $uibModalInstance.close(res); //failed
        });
    };
}]);

function getProductData(productList) {
    var productData = [];
    productList.forEach(function (product) {
        var data = {};
        data.qty = product.qty;
        data.rate = product.rate;
        data.total = product.total;
        data.unit = product.unit;
        data.productId = product.product._id;
        data.productName = product.product.name;
        productData.push(data);
    });
    return productData;

}
