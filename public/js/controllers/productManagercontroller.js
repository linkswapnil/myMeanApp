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
            templateUrl: 'js/templates/addProduct.html',
            controller: 'addProductController'
        });

        modalInstance.result.then(function (newProduct) {
            console.log('feedback',newProduct);
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

    $scope.saveProduct = function(){

        var data = {
            name: $scope.productName,
            retailPrice: 11.10,
            wholeSaleprice: 10,
            inStock : 100,
            firm : 'ATC',
            brand: 'India Gate',
            mrp : 12,
            tax : 5,
            iconURL : imageElement.src
        };

        productService.addProduct(data).$promise.then(function (res) {
            $uibModalInstance.close(res);
        })
    };
}]);

