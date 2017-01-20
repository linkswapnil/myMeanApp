/**
 * Created by navalaks on 1/20/17.
 */
myApp.factory('firmService', function ($resource) {
    var url = 'api/firm/:id';
    return $resource(url, {id: '@id'}, {
        getFirms: {
            method: 'GET',
            isArray: true
        },
        addFirm: {
            method: 'POST'
        },
        deleteFirm: {
            method: 'DELETE'
        },
        editFirm: {
            method: 'PUT'
        }
    });
});
