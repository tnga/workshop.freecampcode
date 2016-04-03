var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","brunofin","comster404","test_channel","cretetion","sheevergaming","TR7K","OgamingSC2","ESL_SC2", "gameward_heroes", "GamingLive_Dota2", "technology_live", "admiralbulldog"];

function getChannelInfo() {
  
  channels.forEach(function(channel) {
    
    function makeURL(type, name) {
      
      return 'https://api.twitch.tv/kraken/' + type + '/' + name + '?callback=?';
    };
    
    $.getJSON(makeURL("streams", channel), function(data) {
      
      var game,
          status;
      if (data.stream === null) {
        game = "Offline";
        status = "offline";
      } else if (data.stream === undefined) {
        game = "Account Closed";
        status = "offline";
      } else {
        game = data.stream.game;
        status = "online";
      };
      
      $.getJSON(makeURL("channels", channel), function(data) {
        
        var logo = iJS.isSet( data.logo ) ? data.logo : "http://dummyimage.com/300x300/ecf0e7/5c5457.jpg&text=0x3F",
            name = iJS.isSet( data.display_name ) ? data.display_name : channel,
            bLang = iJS.isSet( data.broadcaster_language ) ? data.broadcaster_language : "?",
            bViews = iJS.isSet( data.views ) ? data.views : "???",
            bFollowers = iJS.isSet( data.followers ) ? data.followers : "???",
            description = status === "online" ? ': ' + data.status : "";
        html = '<figure class="i-block rm-style grid col-1-of-4 '+ 
          status +'" ><span>' + 
          status + '</span><span>lang: <b>' +
          bLang + '</b><br/>views: <b>' +
          bViews + '</b><br/>followers: <b>' +
          bFollowers + '</b></span><img src="' + 
          logo + '" class="logo" /><figcaption><a href="' + 
          data.url + '" target="_blank"><h4>' + 
          name + '</h4></a><div>'+ 
          game + '<span>' + 
          description + '</span></figcaption></figure>';
        
        status === "online" ? $("#display").prepend(html) : $("#display").append(html);

        $(".online, .offline").on("mouseover", function () {
          
          iJS.animate(this, "pulse") ;
        })
        $(".online, .offline").on("click", function () {
          
          document.location.href = this.childNodes[3].firstElementChild.href ;
        })
        
        console.log( data ) ;
      });
    });
  });
};

/*loader start/stop animation*/
function animateLoader (status) {

  if (status === "start") {

    $("#loader-zone").css("display", "block") ;
    iJS.animate( $("#loader-zone >i")[0], "flip", 45 ) ;
  }
  else {

    $("#loader-zone").css("display", "none") ;
  }
}

$(document).ready(function() {
  
  getChannelInfo();
  
  $("input[name='status']").click(function() {
    
    var status = $(this).attr('value');
    if (status === "all") {
      $(".online, .offline").removeClass("no-display");
    } else if (status === "online") {
      $(".online").removeClass("no-display");
      $(".offline").addClass("no-display");
    } else {
      $(".offline").removeClass("no-display");
      $(".online").addClass("no-display");
    }
  }) ;
  
});