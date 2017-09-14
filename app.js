(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', foundItems);

  function foundItems() {
    var ddo = {
      restrict: 'AE',
      templateUrl: "found-items.html"
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var items = this;
    items.found = "";

    items.getMatchedMenuItems = function() {
      var promise = MenuSearchService.getMatchedMenuItems();
      promise.then(function (response){
        items.found = response;
      });
    };

    items.dontWantThis = function(index) {
      items.found.splice(index,1);
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  // MenuSearchService.$inject = ['$http', '$filter', 'ApiBasePath'];
  // function MenuSearchService($http, $filter, ApiBasePath) {

  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function () {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })
      .then(function (response) {
        console.log(response.data);
        var menu_items = response.data.menu_items;
        return menu_items;
      })
      .catch(function (error) {
        console.log(error);
        return "";
      });
    };
  }

})();
