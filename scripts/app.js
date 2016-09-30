/**
 * Created by zhuyongxuan1 on 2016/9/30.
 */
(function () {
  'use strict';
  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .controller('FoundItemsController', FoundItemsController)
    .service("MenuSearchService", MenuSearchService)
    .directive('foundItems', foundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var controller = this;
    controller.found = [];
    controller.display = true;
    controller.search = function () {
      if (controller.searchTerm === '') {
        controller.display = false;
        return;
      }
      MenuSearchService.getMatchedMenuItems(controller.searchTerm).then(
        function (response) {
          controller.found = response;
          if (controller.found.length === 0) {
            controller.display = false;
          } else {
            controller.display = true;
          }
        }
      );
    };
    controller.remove = function (index) {
      controller.found.splice(index, 1);
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
    service.getMatchedMenuItems = function (searchItem) {
      return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
        .then(
          function (response) {
            var foundItems = [];
            var returnItems = response.data.menu_items;
            returnItems.forEach(function (item) {
              if (item.description.toLowerCase().indexOf(searchItem) !== -1) {
                foundItems.push(item);
              }
            });
            return foundItems;
          }
        )
    }
  }

  function foundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items : '<',
        display: '<',
        onRemove: '&'
      },
      controller: FoundItemsController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsController() {
    var list = this;
  }
})();