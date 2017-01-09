/**
 * Created by navalaks on 11/18/16.
 */
myApp.controller('productManagerController',  ['$scope', '$http', 'NgTableParams', 'productService','ngTableDefaultGetData','$uibModal', function ($scope, $http, NgTableParams, productService, ngTableDefaultGetData, $uibModal) {
    $scope.productData = [];
    $scope.date = new Date();
    $scope.feedback = {};
    $scope.feedback.visible = false;

    function initTable(){
        productService.getProducts().$promise.then(function (data) {
            $scope.productData = data;
            $scope.tableParams =  new NgTableParams({
                page: 1,            // show first page
                count: 10,           // count per page,
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                counts: [5, 10, 15],
                total: data.length,           // length of data
                getData: function(params) {
                    var params1 = new NgTableParams(params.url()),
                        result=[];
                    result = ngTableDefaultGetData($scope.productData, params1);
                    return result;
                }
            });
        });
    }
    initTable();

    $scope.hideFeedBack = function () {
        $scope.feedback.visible = false;
    };

    $scope.deleteProduct = function (id) {
        productService.deleteProduct({id:id}).$promise.then(function (res) {
            $scope.feedback.icon = 'check';
            $scope.feedback.visible = true;
            $scope.feedback.status = 'success';
            $scope.feedback.message = res.message;
            initTable();
        },function (res) {
            $scope.feedback.icon = 'close';
            $scope.feedback.visible = true;
            $scope.feedback.status = 'danger';
            $scope.feedback.message = res.message;
        });
    };

    $scope.editProduct = function (product) {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/editProduct.html',
            controller: 'editProductController',
            bindToController : true,
            resolve: {
                product: function () {
                    return product;
                }
            }
        });

        modalInstance.result.then(function (response) {
            $scope.feedback.message = response.message;

            if(response.status === 'success'){
                $scope.feedback.icon = 'check';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'success';
                initTable();
            }else{
                $scope.feedback.icon = 'close';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'danger';
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.addProduct = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/addProduct.html',
            controller: 'addProductController'
        });

        modalInstance.result.then(function (response) {
            $scope.feedback.message = response.message;

            if(response.status === 'success'){
                $scope.feedback.icon = 'check';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'success';
                initTable();
            }else{
                $scope.feedback.icon = 'close';
                $scope.feedback.visible = true;
                $scope.feedback.status = 'danger';
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

function createHiddenIframe() {
    var iFrame = document.createElement('iframe');
    iFrame.style.display = "none";
    iFrame.src = 'api/product/upload';
    iFrame.name = 'imageUploader';
    document.body.appendChild(iFrame);
    return iFrame;
}

myApp.controller('editProductController',['$scope', '$uibModalInstance', 'product', 'productService',function ($scope, $uibModalInstance, product, productService) {

  $scope.model = {};

  var keys = Object.keys(product);

  keys.forEach(function (key) {
     $scope.model[key] = product[key];
  });

    var imageElement, container;

    $scope.init = function () {
        var hiddenIframe = createHiddenIframe();
        var imageInput = document.getElementById('editImageInput');
        imageElement = document.getElementById('editProductIcon');
        container =  document.getElementById('editProduct');

        function uploadImage(evt) {
            var form = hiddenIframe.contentWindow.document.querySelector('form');
            var imageClone = evt.srcElement.cloneNode(true);
            imageClone.addEventListener('change',uploadImage);
            form.appendChild(evt.srcElement);
            container.appendChild(imageClone);
            form.submit();
        }

        imageInput.addEventListener('change',uploadImage);

        hiddenIframe.onload = function () {
            var content = hiddenIframe.contentWindow.document.body;
            var form = content.querySelector('form');
            if(!form){
                imageElement.src = 'images/uploads/' + JSON.parse(content.querySelector('pre').innerHTML).filename;
                hiddenIframe.contentWindow.location.href = 'api/product/upload';
            }
        };
    };

    $scope.editProduct = function(){

        var data = {
            name: $scope.model.name,
            retailPrice: $scope.model.retailPrice,
            wholeSaleprice: $scope.model.wholeSaleprice,
            inStock : $scope.model.inStock,
            firm : $scope.model.firm,
            brandName: $scope.model.brandName,
            mrp : $scope.model.mrp,
            tax : $scope.model.tax,
            iconURL : imageElement.src.replace(/\/$/,'') //get rid of / at the end of src
        };

        productService.editProduct({id: $scope.model._id}, data).$promise.then(function (res) {
            res.status = "success";
            $uibModalInstance.close(res);
        },function (res) {
            res.status = "failed";
            res.message = res.data.message;
            $uibModalInstance.close(res); //failed
        });
    };

  $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

myApp.controller('addProductController',['$scope', '$uibModalInstance', 'productService', function ($scope, $uibModalInstance, productService) {

    var imageElement, container;

    $scope.init = function () {
        var hiddenIframe = createHiddenIframe();
        var imageInput = document.getElementById('imageInput');
        imageElement = document.getElementById('productIcon');
        container =  document.getElementById('addProduct');

        function uploadImage(evt) {
            var form = hiddenIframe.contentWindow.document.querySelector('form');
            var imageClone = evt.srcElement.cloneNode(true);
            imageClone.addEventListener('change',uploadImage);
            form.appendChild(evt.srcElement);
            container.appendChild(imageClone);
            form.submit();
        }

        imageInput.addEventListener('change',uploadImage);

        hiddenIframe.onload = function () {
            var content = hiddenIframe.contentWindow.document.body;
            var form = content.querySelector('form');
            if(!form){
                imageElement.src = 'images/uploads/' + JSON.parse(content.querySelector('pre').innerHTML).filename;
                hiddenIframe.contentWindow.location.href = 'api/product/upload';
            }
        };
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProduct = function(){

        var data = {
            name: $scope.productName,
            retailPrice: 11.10,
            wholeSaleprice: 10,
            inStock : 100,
            firm : 'ATC',
            brandName: $scope.brandName,
            mrp : 12,
            tax : 5,
            iconURL : imageElement.src.replace(/\/$/,'') //get rid of / at the end of src
        };

        productService.addProduct(data).$promise.then(function (res) {
            res.status = "success";
            $uibModalInstance.close(res);
        },function (res) {
            res.status = "failed";
            res.message = res.data.message;
            $uibModalInstance.close(res); //failed
        });
    };
}]);

