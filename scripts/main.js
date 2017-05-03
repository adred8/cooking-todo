function myFunction() {
    document.getElementById("popupModal").style.display = "none";
    document.getElementById("confirmModal").style.display = "block";
}

(function(){
  var app = angular.module("NarrowItDownApp", ["ngRoute"]);
  app.config(function($routeProvider){
    $routeProvider
      .when("/user", {
        templateUrl : "templates/user.html",
        controller : "userController",
        controllerAs : "userCtrl"
      })
      .when("/recipe", {
        templateUrl : "templates/recipe.html",
        controller : "NarrowItDownController",
        controllerAs : "Nid"
      })
  });
  app.controller("NarrowItDownController", NarrowItDownController);
  app.controller("userController", userController);
  app.service("MenuSearchService", MenuSearchService);


  userController.$inject = ["MenuSearchService"];
  function userController (MenuSearchService){
    var userCtrl = this;
    userCtrl.favRecipeList = MenuSearchService.favRecipeList;
    userCtrl.removeFavItem = function(index){
      userCtrl.favRecipeList = MenuSearchService.removeFavItem(index);
    }
  };

  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController (MenuSearchService, $q){
    var Nid = this;
    Nid.searchTerm = "";
    Nid.message = "";

    Nid.searchRecipes = function(){
      Nid.message = "searching..."
      var getMyMenuItems = MenuSearchService.getMatchedMenuItems(Nid.searchTerm);
      getMyMenuItems.then(function(response){
        Nid.response = response;
        Nid.found = Nid.response.hits;
        console.log("Nid.found = ",  Nid.found);
        console.log("Nid.response = ", Nid.response);
        Nid.message = "Done !";
      });
      getMyMenuItems.catch(function(error){
        Nid.response = error;
        console.log("Nid.response = ", Nid.response);
        Nid.message = "Error found";
      });
    };
    Nid.favRecipeList = MenuSearchService.favRecipeList;

    Nid.addingItem = function(index){
      console.log("Nid.found[index]", Nid.found[index]);
      Nid.favRecipeList = MenuSearchService.addingRecipe(index, Nid.found);
      console.log("fav recipe list", Nid.favRecipeList);
    };

    console.log("final list", Nid.favRecipeList);

  };

  MenuSearchService.$inject = ["$http", "$q", "$timeout"];
  function MenuSearchService($http, $q, $timeout){
    var service = this;

    service.favRecipeList = [];
    service.shopList = [];

    service.addingRecipe = function(idx, arr){
      service.favRecipeList.push(arr[idx]);
      return service.favRecipeList;
    };

    // service.removeItem = function(idx, arr){
    //   arr.splice(idx, 1);
    //   return arr;
    // };

    service.removeFavItem = function(idx){
      service.favRecipeList.splice(idx,1);
      console.log("favRecipeList = ", service.favRecipeList);
      return service.favRecipeList;
    };

    service.getMatchedMenuItems = function (searchTerm){
      var message = "";
      var deferred = $q.defer();
      var getItems = $http({
        method: "GET",
        params: {
          q : searchTerm,
          app_id : "94c26889",
          app_key : "e9ca84809360cb90d8bea638f7deab4c",
          from : 0,
          to : 10
        },
        url: ("https://api.edamam.com/search")
      });
      getItems.then(function(response){
        console.log("response.data.Frames = ", response.data);
        deferred.resolve(response.data);
      });

      getItems.catch(function(error){
        console.log("error found");
        deferred.reject(error);
      })

      return deferred.promise;
    };
  };

})();
