(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', foundItems);

  function foundItems() {
    var ddo = {
      restrict: 'E',
      templateUrl: "found-items.html",
      // scope: {
      //   found: '<',
      //   onRemove: '&'
      // },

  //     controller: ShoppingListDirectiveController,
  //     controllerAs: 'list',
  //     bindToController: true
    };

    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var items = this;
    items.found = "";
    items.searchText = "";
    items.nothingFoundYet = false;

    items.getMatchedMenuItems = function() {
      var promise = MenuSearchService.getMatchedMenuItems(items.searchText);
      promise.then(function (response){
        items.found = response;
        items.nothingFoundYet = ( response.length !== 0 ) ? false : true;

        console.log("not found: ", items.nothingFoundYet);
      });
    };

    items.dontWantThis = function(index) {
      items.found.splice(index,1);
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {

      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })
      .then(function (response) {
        var items = [];
        var description;

        console.log("** search term: ", searchTerm);
        console.log("** return values **");
        console.log(response.data);

        if (searchTerm.length === 0) {
          console.log("textbox empty");
          return items;
        }

        var menu_items = response.data.menu_items;

        for (var i in menu_items) {
          description = menu_items[i].description;
          if ( description.indexOf(searchTerm) !== -1 ) {
            items.push(menu_items[i]);
          }
        }
        return items;
      })
      .catch(function (error) {
        console.log(error);
        return "";
      });
    };
  }

})();
