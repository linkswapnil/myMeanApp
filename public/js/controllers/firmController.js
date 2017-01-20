/**
 * Created by navalaks on 1/20/17.
 */
myApp.controller('firmController', ['$scope', 'NgTableParams', 'firmService', 'ngTableDefaultGetData', '$uibModal', function ($scope, NgTableParams, firmService, ngTableDefaultGetData, $uibModal) {

    $scope.firmData = [];
    $scope.feedback = {};
    $scope.feedback.visible = false;

    function initTable() {
        firmService.getFirms().$promise.then(function (data) {
            $scope.firmData = data;
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
                    result = ngTableDefaultGetData($scope.firmData, params1);
                    return result;
                }
            });
        });
    }

    initTable();

    $scope.hideFeedBack = function () {
        $scope.feedback.visible = false;
    };

    $scope.deleteFirm = function (id) {
        firmService.deleteFirm({id: id}).$promise.then(function (res) {
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

    $scope.editFirm = function (firm) {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/firm/editFirm.html',
            controller: 'editFirmController',
            windowClass: 'app-modal-window',
            resolve: {
                firm: function () {
                    return firm;
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

    $scope.addFirm = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'js/templates/firm/addFirm.html',
            controller: 'addFirmController',
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

function createHiddenIframe() {
    var iFrame = document.createElement('iframe');
    iFrame.style.display = "none";
    iFrame.src = 'api/firm/upload';
    iFrame.name = 'imageUploader';
    document.body.appendChild(iFrame);
    return iFrame;
}

myApp.controller('editFirmController', ['$scope', '$uibModalInstance', 'firm', 'firmService', function ($scope, $uibModalInstance, firm, firmService) {

    $scope.model = {};

    var keys = Object.keys(firm);

    keys.forEach(function (key) {
        $scope.model[key] = firm[key];
    });

    var imageElement, container;

    $scope.init = function () {
        var hiddenIframe = createHiddenIframe();
        var imageInput = document.getElementById('editImageInput');
        imageElement = document.getElementById('editProductIcon');
        container = document.getElementById('editProduct');

        function uploadImage(evt) {
            var form = hiddenIframe.contentWindow.document.querySelector('form');
            var imageClone = evt.srcElement.cloneNode(true);
            imageClone.addEventListener('change', uploadImage);
            form.appendChild(evt.srcElement);
            container.appendChild(imageClone);
            form.submit();
        }

        imageInput.addEventListener('change', uploadImage);

        hiddenIframe.onload = function () {
            var content = hiddenIframe.contentWindow.document.body;
            var form = content.querySelector('form');
            if (!form) {
                imageElement.src = 'images/uploads/' + JSON.parse(content.querySelector('pre').innerHTML).filename;
                hiddenIframe.contentWindow.location.href = 'api/product/upload';
            }
        };
    };

    $scope.standardUnits = unitService.getStandardUnits();

    $scope.addPriceList = function () {
        $scope.model.priceList.push({});
    };

    $scope.$watch('priceList', function () {
        var a = $scope.model.priceList.filter(function (price) {
            if (price.unit === 'other') {
                return true;
            }
        });
        // when any of the list contains selectedUnit as other
        if (a.length > 0) {
            $scope.displayOthers = true;
        } else {
            $scope.displayOthers = false;
        }

    }, true);

    $scope.removePriceList = function (index) {
        $scope.model.priceList.splice(index, 1);
    };

    $scope.editProduct = function () {

        var data = {
            name: $scope.model.name,
            firm: $scope.model.firm,
            brandName: $scope.model.brandName,
            iconURL: imageElement.src.replace(/\/$/, ''), //get rid of / at the end of src
            priceList: $scope.model.priceList
        };

        productService.editProduct({id: $scope.model._id}, data).$promise.then(function (res) {
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

myApp.controller('addFirmController', ['$scope', '$uibModalInstance', 'firmService', function ($scope, $uibModalInstance, firmService) {

    var imageElement, container;

    $scope.init = function () {
        var hiddenIframe = createHiddenIframe();
        var imageInput = document.getElementById('imageInput');
        imageElement = document.getElementById('firmIcon');
        container = document.getElementById('addFirm');

        function uploadImage(evt) {
            var form = hiddenIframe.contentWindow.document.querySelector('form');
            var imageClone = evt.srcElement.cloneNode(true);
            imageClone.addEventListener('change', uploadImage);
            form.appendChild(evt.srcElement);
            container.appendChild(imageClone);
            form.submit();
        }

        imageInput.addEventListener('change', uploadImage);

        hiddenIframe.onload = function () {
            var content = hiddenIframe.contentWindow.document.body;
            var form = content.querySelector('form');
            if (!form) {
                imageElement.src = 'images/uploads/' + JSON.parse(content.querySelector('pre').innerHTML).filename;
                hiddenIframe.contentWindow.location.href = 'api/firm/upload';
            }
        };
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveFirm = function () {

        var data = {
            name: $scope.firmName,
            address: $scope.address,
            contactNumber: $scope.contactNumber,
            tinNumber: $scope.tinNumber,
            iconURL: imageElement.src.replace(/\/$/, '') //get rid of / at the end of src
        };

        firmService.addFirm(data).$promise.then(function (res) {
            res.status = "success";
            $uibModalInstance.close(res);
        }, function (res) {
            res.status = "failed";
            res.message = res.data.message;
            $uibModalInstance.close(res); //failed
        });
    };
}]);
