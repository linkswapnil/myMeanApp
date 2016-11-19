/**
 * Created by navalaks on 11/18/16.
 */
myApp.controller('headerController',  ['$scope', '$http' ,'menuService', function ($scope, $http, menuService) {
    console.log("Ha Ha header");
    $scope.getActiveMenu = function(){
        return menuService.getActiveMenu();
    }
}]);
