/**
 * Created by navalaks on 1/20/17.
 */
myApp.factory('purchaseService', function ($resource) {
    var url = 'api/purchase/:id';
    return $resource(url, {id: '@id'}, {
        getPurchases: {
            method: 'GET',
            isArray: true
        },
        addPurchase: {
            method: 'POST'
        },
        deletePurchase: {
            method: 'DELETE'
        },
        editPurchase: {
            method: 'PUT'
        }
    });
});
