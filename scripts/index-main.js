var eventposted=0;
document.cookie = "username=admin; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
$(document).ready(function(){
  $('.submit-button').on("click", function() {
    var user = $('.username-input').val();
    console.log(user);
    var pass = $('.pass-input').val();
    console.log(pass);
    if (user === "admin" && pass === "admin"){
      window.setInterval(foo, 100);
      document.cookie = "username=admin;";
    }
    else{
      $(".error").text("Either username or password is incorrect");
    }
  });
});
function foo(){
  if(eventposted==0) {
   eventposted = 1;
   window.location.href = "landing.html";
  }
};
function setCookie(name, value, expTimeSecs){
  var d = new Date();
  d.setTime(d.getTime() + (expTimeSecs * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/"
};
