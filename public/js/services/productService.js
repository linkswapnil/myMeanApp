/**
 * Created by navalaks on 11/18/16.
 */
myApp.factory('productService', function ($resource) {
 var url = 'api/product/:id';
  return $resource(url, {id:'@id'}, {
          getProducts: {
              method: 'GET',
              isArray: true
          },
          addProduct : {
              method: 'POST'
          },
          deleteProduct : {
              method: 'DELETE'
          },
          editProduct : {
              method: 'PUT'
          }
      }
)});
