/**
 * Created by navalaks on 11/18/16.
 */
myApp.controller('mainController',  ['$scope', '$location', 'menuService', function ($scope, $location, menuService) {
    console.log("Ha Ha MainController");
    $scope.menuItems = menuService.getMenuItems();
    menuService.setActiveMenu($scope.menuItems[0]);

    $scope.getActiveMenu = function(){
        menuService.getActiveMenu();
    };

    $scope.isActive = function (menu) {
        if(menu.route === $location.path()){
            menuService.setActiveMenu(menu);
            return true;
        }
    }

}]);
