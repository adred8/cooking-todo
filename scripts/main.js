function myFunction() {
    document.getElementById("popupModal").style.display = "none";
    document.getElementById("confirmModal").style.display = "block";
}

(function(){
  var app = angular.module("NarrowItDownApp", []);
  app.controller("NarrowItDownController", NarrowItDownController);
  app.service("MenuSearchService", MenuSearchService);


  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController (MenuSearchService, $q){
    var Nid = this;
    Nid.searchTerm = "";
    Nid.message = "";
    Nid.foundMessage = "";
    var getMyMenuItems = MenuSearchService.getMatchedMenuItems();
    getMyMenuItems.then(function(response){
      Nid.response = response;
      Nid.found = Nid.response.Frames;
      console.log("yea = ",  Nid.found);
      console.log("Nid.response = ", Nid.response);
      // console.log("sdsd = ",Nid.found.Frames );
      // console.log("sdsd = ",Nid.found.Frames[0].images[0] );
    });
    getMyMenuItems.catch(function(error){
      Nid.response = error;
      console.log("Nid.response = ", Nid.response);
    });


    Nid.searchFrame = function(){
      console.log("key pressed");
      console.log("adas = ", Nid.searchTerm);
      console.log("Nid.found = ", Nid.found);
      console.log("Nid.response = ", Nid.response);
      var newArrObj = [];
      if (Nid.searchTerm == ""){
        Nid.found = Nid.response.Frames;
      }
      else{
        for (var i = 0; i < Nid.response.totalFrames; i++){
          var str = Nid.response.Frames[i].FrameData.frameName.toLowerCase();
          if (str.includes(Nid.searchTerm)){
            newArrObj.push(Nid.response.Frames[i]);
          }
        }
        Nid.found = newArrObj;
      }
    };

    Nid.addingItem = function(index){
      Nid.myFrame = Nid.found[index];
      console.log("frame = ", Nid.myFrame);
    }

  };
// Nid.found.Frames[0].FrameData.frameName
  MenuSearchService.$inject = ["$http", "$q", "$timeout"];
  function MenuSearchService($http, $q, $timeout){
    var service = this;

    service.removeItem = function(idx, arr){
      arr.splice(idx, 1);
      return arr;
    };

    service.addItem = function(idx){

    }

    service.getMatchedMenuItems = function (){
      service.found = [];

      var message = "";
      var deferred = $q.defer();
      var getItems = $http({
        method: "GET",
        // https://api.edamam.com/search
        // url: ("https://yudql2tsmh.execute-api.us-east-1.amazonaws.com/testStichio/testing/b8680137-fde7-437d-80d9-d88b92633e97/?q=profileView"),
        url: ("https://api.edamam.com/search"),
        headers: {'Authorization': 'Token d0689f1e3ac6a820ce598c372b92e920a18a58cd'}
      });
      getItems.then(function(response){
        // console.log("response.data.Frames = ", response.data);
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
