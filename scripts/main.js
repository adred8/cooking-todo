$(document).ready(function(){
  if (document.cookie !== "username=admin"){
    window.location.href = "index.html";
  }
  $(".logout-button").on('click', function(){
    document.cookie = "username=admin; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.setItem("localFavRecipes", null);
    localStorage.setItem("localShopList", null);
  });
});

// console.log("localTemp = ", localTemp);

(function(){
  var app = angular.module("NarrowItDownApp", ["ngRoute"]);
  app.config(function($routeProvider){
    $routeProvider
      .when("/", {
        templateUrl : "templates/main.html",
      })
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
  app.service("ShoppingService", ShoppingService);


  userController.$inject = ["MenuSearchService", "ShoppingService"];
  function userController (MenuSearchService, ShoppingService){
    var userCtrl = this;

    userCtrl.itemName = "";
    userCtrl.itemQuantity = "";
    userCtrl.itemUnits = "";
    // userCtrl.editName = "";
    // userCtrl.editQuantity = "";
    // userCtrl.editItems = "";
    // userCtrl.showShopItem = 1;
    // userCtrl.editedItem = [];
    // userCtrl.edited = function(index){
    //   userCtrl.showShopItem = 1;
    //
    //   userCtrl.editedItem[0].itemName = userCtrl.editName;
    //   userCtrl.editedItem[0].itemQuantity = userCtrl.editQuantity;
    //   userCtrl.editedItem[0].itemUnits = userCtrl.editUnits;
    // }
    // userCtrl.editShopItem = function(index){
    //   console.log("userCtrl.shopList[idx]", userCtrl.shopList[index]);
    //   userCtrl.showShopItem = 2;
    //   userCtrl.editedItem.push(userCtrl.shopList[index]);
    //   console.log("userCtrl.editedItem", userCtrl.editedItem);
    //   userCtrl.editName = userCtrl.editedItem[0].itemName;
    //   userCtrl.editQuantity = userCtrl.editedItem[0].itemQuantity;
    //   userCtrl.editUnits = userCtrl.editedItem[0].itemUnits;
    // }

    userCtrl.shopList = ShoppingService.shopList;
    console.log("userCtrl.shopList = ", userCtrl.shopList);
    console.log("userCtrl.shopList.length = ", userCtrl.shopList.length);
    userCtrl.removeShopItem = function(index){
      userCtrl.shopList = ShoppingService.removeShopItem(index);
    }
    userCtrl.addShopItem = function(){
      userCtrl.shopList = ShoppingService.addShopItem(userCtrl.itemName, userCtrl.itemQuantity, userCtrl.itemUnits);
      userCtrl.itemName = "";
      userCtrl.itemQuantity = "";
      userCtrl.itemUnits = "";
    }

    userCtrl.favClass = "activeList";
    userCtrl.shopClass = "";
    userCtrl.displayList = 1;
    userCtrl.favListDisplay = function(){
      userCtrl.displayList = 1;
      userCtrl.favClass = "activeList";
      userCtrl.shopClass = "";
    }
    userCtrl.shopListDisplay = function(){
      userCtrl.displayList = 0;
      userCtrl.favClass = "";
      userCtrl.shopClass = "activeList";
    }

    userCtrl.recipeShow = 0;
    userCtrl.showRecipe = function(index){
      userCtrl.recipeShow = 1;
      userCtrl.recipeDisplay = userCtrl.favRecipeList[index];
    }
    userCtrl.hideRecipe = function(){
      userCtrl.recipeShow = 0;
    }
    userCtrl.favRecipeList = MenuSearchService.favRecipeList;
    console.log("length", userCtrl.favRecipeList.length);
    console.log("userCtrl.favRecipeList", userCtrl.favRecipeList);
    userCtrl.removeFavItem = function(index){
      userCtrl.favRecipeList = MenuSearchService.removeFavItem(index);
    }
  };

  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController (MenuSearchService, $q){
    var Nid = this;

    // Nid.disableScroll = 1;
    Nid.scrollClass = "ableScroll";
    Nid.recipeShow = 0;
    Nid.showRecipe = function(index){
      Nid.recipeShow = 1;
      Nid.scrollClass = "disableScroll";
      console.log("Nid.scrollClass", Nid.scrollClass);
      Nid.recipeDisplay = Nid.found[index];
    }
    Nid.hideRecipe = function(){
      Nid.recipeShow = 0;
      // Nid.disableScroll = 0;
      Nid.scrollClass = "ableScroll";
      console.log("Nid.scrollClass", Nid.scrollClass);
    }

    Nid.searchTerm = "";
    Nid.searchMessage = "";
    Nid.displaySuccessMessage = 0;
    Nid.successMessage = "";
    Nid.searchRecipes = function(){
      if (Nid.searchTerm === ""){
        Nid.displaySuccessMessage = 1;
        Nid.searchMessage = "Please type something in search box...";
      }
      else{
        Nid.searchMessage = "Searching..."
        var getMyMenuItems = MenuSearchService.getMatchedMenuItems(Nid.searchTerm);
        getMyMenuItems.then(function(response){
          Nid.response = response;
          Nid.found = Nid.response.hits;
          console.log("Nid.found = ",  Nid.found);
          console.log("Nid.response = ", Nid.response);
          // Nid.message = "Done !";
          if (Nid.found.length != 0){
            Nid.searchMessage = "";
          }
          else{
            Nid.searchMessage = "Nothing found";
          }

          Nid.displaySuccessMessage = 1;
          Nid.successMessage = Nid.searchTerm;
          Nid.searchTerm = "";
        });
        getMyMenuItems.catch(function(error){
          Nid.response = error;
          console.log("Nid.response = ", Nid.response);
          Nid.searchMessage = "Error found";
          Nid.searchTerm = "";
        });
      }
    };
    // Nid.favRecipeList = MenuSearchService.favRecipeList;

    Nid.addingItem = function(index){
      console.log("Nid.found[index]", Nid.found[index]);
      console.log("Nid.found = ", Nid.found);
      // Nid.favRecipeList = MenuSearchService.addingRecipe(index, Nid.found);
      MenuSearchService.addingRecipe(index, Nid.found);
      // console.log("fav recipe list", Nid.favRecipeList);
    };

    // console.log("final list", Nid.favRecipeList);

  };

  function ShoppingService(){
    var shop = this;

    var localShop = localStorage.getItem("localShopList");
    localShop = JSON.parse(localShop);
    console.log("localShopList = ", localShop);
    if (localShop != null){
      console.log("localShopList is not null");
      shop.shopList = localShop;
    }
    else{
      shop.shopList = [];
    }
    // shop.shopList = [];
    shop.addShopItem = function(name, quantity, units){
      var item = {"name" : name, "quantity" : quantity, "units" : units};
      shop.shopList.push(item);
      var localShop = shop.shopList;
      localShop = JSON.stringify(localShop);
      localStorage.setItem("localShopList", localShop);
      return shop.shopList;
    }

    shop.removeShopItem = function(idx){
      shop.shopList.splice(idx, 1);
      var localShop = shop.shopList;
      localShop = JSON.stringify(localShop);
      localStorage.setItem("localShopList", localShop);
      return shop.shopList;
    }

  }

  MenuSearchService.$inject = ["$http", "$q", "$timeout"];
  function MenuSearchService($http, $q, $timeout){
    var service = this;
    service.displayValue = 0;
    service.setDisplayRecipe = function(index){
      service.displayValue = 1;
      return service.displayValue;
    }

    var localFav = localStorage.getItem("localFavRecipes");
    localFav = JSON.parse(localFav);
    console.log("localFav = ", localFav);
    if (localFav != null){
      console.log("localFav is not null");
      service.favRecipeList = localFav;
    }
    else{
      service.favRecipeList = [];
    }

    service.addingRecipe = function(idx, arr){
      console.log("adding recipe to favourites*************");

      console.log("arr = ", arr);
      console.log("idx = ", idx);
      console.log("arr[idx] = ", arr[idx]);
      var insideArr = 0;
      console.log("service.favRecipeList" , service.favRecipeList);
      for (var k = 0; k < service.favRecipeList.length; k++){
        if (arr[idx].recipe.label === service.favRecipeList[k].recipe.label){
          console.log("present in array");
          insideArr = 1;
        }
      }
      if (insideArr === 0){
        service.favRecipeList.push(arr[idx]);
        var localFav = service.favRecipeList;
        localFav = JSON.stringify(localFav);
        localStorage.setItem("localFavRecipes", localFav);
      }
      return service.favRecipeList;
    };

    service.removeFavItem = function(idx){
      service.favRecipeList.splice(idx, 1);
      console.log("idx = ", idx);
      console.log("favRecipeList = ", service.favRecipeList);
      var localFav = service.favRecipeList;
      localFav = JSON.stringify(localFav);
      localStorage.setItem("localFavRecipes", localFav);
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
        service.localSearch = response.data;
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
