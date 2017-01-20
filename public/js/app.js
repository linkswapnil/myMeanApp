/**
 * Created by navalaks on 11/16/16.
 */
var myApp = angular.module('myApp', ['ngRoute','ngResource', 'ngTable','ui.bootstrap']);

myApp.config(function($routeProvider){
    $routeProvider
        .when("/productManagement", {
            templateUrl: "js/templates/manageProducts.html",
            controller: "productManagerController"
        })
        .when("/purchaseManagement", {
            templateUrl: "js/templates/purchaseManagement.html",
            controller: "purchaseManagerController"
        })
        .when("/firmManagement", {
            templateUrl: "js/templates/firm/manageFirms.html",
            controller: "firmController"
        })
        // .when("/private", {
        //     templateUrl: "private",
        //     controller: "GeneralController",
        //     controllerAs: "context",
        //     authorize: true
        // })
        .otherwise({
            redirectTo: "/"
        });
});
