var ans = "";
var clear = false;
var calc = "";
$(document).ready( function () {
  
  window.calcDisplayBox = document.getElementById("display") ;
  centerContentPosition() ;
  //pour centrer suivant la hauteur le contenu de la boite de dialogue
  $(window).on('resize', centerContentPosition) ;
  
  $("button").click( function () {
    
    var text = $(this).attr("value");
    if (parseInt(text, 10) == text || text === "." || text === "/" || text === "*" || text === "-" || text === "+" || text === "%") {
      if (clear === false) {
        calc += text;
      } 
      else {
        calc = text;
        clear = false;
      }
      $(".textbox").val(calc);
    } 
    else if (text === "AC") {
      calc = "";
      $(".textbox").val("");
    } 
    else if (text === "CE") {
      calc = calc.slice(0, -1);
      $(".textbox").val(calc);
    } 
    else if (text === "Ans") {
      calc += ans ;
      $(".textbox").val(calc);
      clear = false;
    } 
    else if (text === "=") {
      ans = eval(calc);
      $(".textbox").val(ans);
      clear = true;
      calc = "" ;
    }
  });
});


var isResultMode = false ,
    maxDSHeight = 0 ,
    dsMargin = 0 ;
//centre suivant la hauteur le contenu de la boite de dialogue
function centerContentPosition () {

  if (! isResultMode) {

    maxDSHeight = document.body.offsetHeight - (document.body.offsetHeight * 30 / 100) ;

    if ( calcDisplayBox.offsetHeight > maxDSHeight) {

      calcDisplayBox.offsetHeight = (maxDSHeight >= 100) ? maxDSHeight + "px" : "100px" ;
      calcDisplayBox.style.margin = "5% auto" ;

    } else {

      dsMargin = (document.body.offsetHeight - calcDisplayBox.offsetHeight) / 2 ;

      calcDisplayBox.style.margin = dsMargin + "px auto 10px auto" ;
      document.body.style.overflow = "hidden" ; //just for design, not really needed.
    }
  }
}