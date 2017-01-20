myApp.service("menuService", function($location){
    var self = this;
    self.role = self.role || document.getElementById('role').value;
    self.userName = self.role || document.getElementById('username').value;
    self.menus = {
        "firms": {
            name: "Firms",
            title: "Firm Management",
            route: "/firmManagement",
            icon: 'fa-university'
        },
        "products" : {
            name: "Products",
            title : "Product Management",
            route : "/productManagement",
            icon : 'fa-cubes'
        },
        "purchase" : {
            name: "Purchase",
            title : "Purchase Management",
            route : "/purchaseManagement",
            icon : 'fa-cart-arrow-down'
        }
    };

    self.getMenuItems = function () {
        var menuList = [];
        if(self.role === 'admin'){
            menuList.push(self.menus['firms']);
            menuList.push(self.menus['products']);
            menuList.push(self.menus['purchase']);
        } else if (self.role === 'operator') {
            menuList.push(self.menus['purchase']);
        }
        return menuList;
    };

    self.setActiveMenu = function (activeMenu) {
       // self.activeMenu = self.getMenuItems()[0];
        $location.path(activeMenu.route);
        self.activeMenu = activeMenu;
    };

    self.getActiveMenu = function () {
        return self.activeMenu;
    };
});
