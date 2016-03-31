$(document).ready( function () {
  
  window.wikiSearcBox = document.getElementById("search-block") ;
  animateLoader("hide") ;
  centerContentPosition() ;
  iJS.animate(wikiSearcBox, "fade-in-down") ;
  //pour centrer suivant la hauteur le contenu de la boite de dialogue
  $(window).on('resize', centerContentPosition) ;
  
  $("#search-block input[name='wiki-search']").on("change", function () {
    
    animateLoader("start") ;
    $("#search-alert").css("display", "none") ;
    if (! $("#search-block").hasClass("sb-style")) $("#search-block").addClass("sb-style") ;
    
    var api = 'http://'+searchLang+'.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    
    $.getJSON( api + this.value+"&callback=?" )
    .done( function (data) {
      
      if (iJS.isObject( data.query )) {
        
        var htmlResults = "" ,
            basePageURI = 'http://en.wikipedia.org/?curid=';
        
        $.each( data.query.pages, function(i, v) {
          
          htmlResults += "<a class='i-block' target='_blank' href='"+basePageURI + v.pageid+"'> \n"+
              "<H4>"+v.title+"</H4> \n"+
              "<span>"+v.extract+"</span> \n"+
            "</a> \n" ;
        }) ;
        
        $("#search-results").css("display", "block" ) ;
        $("#search-results").html( htmlResults ) ;
        $("body").css("overflow", "auto") ;
        $("#search-block").css("margin", "0px auto 15px auto") ;
        
        iJS.animate(wikiSearcBox, "fade-in-down") ;
        isResultMode = true ;
      }
      else {
        
        $("#search-alert").css("display", "block") ;
        $("#search-alert").text("Humm! can't get matched result...") ;
        $("#search-results").css("display", "none" ) ;
        
        isResultMode = false ;
        centerContentPosition() ;
        iJS.animate(wikiSearcBox, "pulse") ;
      }
      
      animateLoader("hide") ;
      
      console.log( data ) ;
    }) 
    .fail( function () {
      
      $("#search-alert").css("display", "block") ;
      $("#search-alert").text("Oops! connexion error...") ;
      $("#search-results").css("display", "none" ) ;
      
      isResultMode = false ;
      centerContentPosition() ;
      iJS.animate(wikiSearcBox, "pulse") ;
      
      animateLoader("hide") ;
    });
    
  });
  
  $("#search-block >select").on("change", function () {
    
    searchLang = this.value ;
    $("#search-block input[name='wiki-search']").triggerHandler("change") ;
  }) ;
  //@NOTE uncomment this to enable search action on button's click.
  /*$("#search-block >button").on("click", function () {
    
    $("#search-block input[name='wiki-search']").triggerHandler("change") ;
  }) ;
  $("#search-block input[name='wiki-search']").click( function(e) {
    e.stopPropagation();
  }); */
  
}) ;


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


var searchLang = "en" ;
    
var isResultMode = false ,
    maxDSHeight = 0 ,
    dsMargin = 0 ;
//centre suivant la hauteur le contenu de la boite de dialogue
function centerContentPosition () {

  if (! isResultMode) {
    
    maxDSHeight = document.body.offsetHeight - (document.body.offsetHeight * 30 / 100) ;

    if ( wikiSearcBox.offsetHeight > maxDSHeight) {

      wikiSearcBox.offsetHeight = (maxDSHeight >= 100) ? maxDSHeight + "px" : "100px" ;
      wikiSearcBox.style.margin = "5% auto" ;

    } else {

      dsMargin = (document.body.offsetHeight - wikiSearcBox.offsetHeight) / 2 ;
      
      wikiSearcBox.style.margin = dsMargin + "px auto 10px auto" ;
      document.body.style.overflow = "hidden" ; //just for design, not really needed.
    }
  }
}