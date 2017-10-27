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
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      bindToController: true,
      controllerAs: 'Ctrl'
    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var items = this;

    items.noItem = function(items) {
      console.log("items: ", items);

      return ( items == undefined ) || ( items.length == 0);
    };
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var items = this;
    items.found = "";
    items.searchText = "";

    items.getMatchedMenuItems = function() {
      var promise = MenuSearchService.getMatchedMenuItems(items.searchText);
      promise.then(function (response){
        items.found = response;
      });
    };

    items.removeItem = function(index) {
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
        var foundItems = [];
        var description;

        console.log("** search term: ", searchTerm);
        console.log("** return values **", response.data);

        if (searchTerm.length === 0) {
          console.log("textbox empty");
          return foundItems;
        }

        var menu_items = response.data.menu_items;

        for (var i in menu_items) {
          description = menu_items[i].description;
          if ( description.indexOf(searchTerm) !== -1 ) {
            foundItems.push(menu_items[i]);
          }
        }
        return foundItems;
      })
      .catch(function (error) {
        console.log("getMatchedMenuItems MenuSearchService - error", error);
        return "";
      });
    };
  }
})();
