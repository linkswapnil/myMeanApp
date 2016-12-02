/**
 * Created by navalaks on 11/18/16.
 */
myApp.factory('productService', function ($resource) {
 var url = 'api/product';
  return $resource(url, {}, {
          getProducts: {
              method: 'GET',
              isArray: true
          }
      }
)});
