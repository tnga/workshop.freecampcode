/*
  Code by Gabriel Nunes
  ajusted by tnga
*/

function inIframe () { try { return window.self !== window.top; } catch (e) { return true; } }

var colors = [["#333", "#ddd"], ["#f02306", "#e9f418"], ['#16a085', '#27ae60'], ['#2c3e50', '#9b59b6'], ['#e74c3c', '#f39c12'], ['#FB6964', '#342224'], ["#77B1A9", "#73A857"]];
var currentQuote = '', currentAuthor = '';
function openURL(url){
  window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}
function getQuote() {
  
  $('#api-info-status').html("<i class='fa fa-fire' id='loader' style='font-size:1.5em'></i>");
  iJS.animate("loader", "flip", 9) ;
  
  $.ajax({
    headers: {
      "X-Mashape-Key": "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V",
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=',
    success: function(response) {
      
      $('#api-info-status').css("display", "none") ;
      
      var r = JSON.parse(response);
      currentQuote = r.quote;
      currentAuthor = r.author;
      if(inIframe())
      {
        $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
        $('#tumblr-quote').attr('href', 'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='+encodeURIComponent(currentAuthor)+'&content=' + encodeURIComponent(currentQuote));
      }
      $(".quote-text").animate({
          opacity: 0
        }, 500,
        function() {
          $(this).animate({
            opacity: 1
          }, 500);
          $('#text').text(r.quote);
          iJS.animate($('.quote-box')[0], "bounce") ;
        });

      $(".quote-author").animate({
          opacity: 0
        }, 500,
        function() {
          $(this).animate({
            opacity: 1
          }, 500);
          $('#author').html(r.author);
        });

      var color = Math.floor(Math.random() * colors.length);
      $("html body").css({
        background: "linear-gradient(to left,"+ colors[color][0] +","+ colors[color][1] +")" ,
        animation: "gradient-animation 30s ease infinite" ,
        color: colors[color][0]
      });
      $(".button").css({
        backgroundColor: colors[color][0]
      });
    },
    
    error: function( jqXHR, strStatus) {
      
      $('#api-info-status').css("display", "block");
      $('#api-info-status').html("<span style='color:red'>Oops! An error occured: "+strStatus+"</span>");
      iJS.animate($('.quote-box')[0], "shake") ;
    }
  });
}
$(document).ready(function() {
  getQuote();
  $('#new-quote').on('click', getQuote);
  $('#tweet-quote').on('click', function() {
    
    iJS.animate($('.quote-box')[0], "pulse") ;
    if(!inIframe()) {
      openURL('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
    }
  });
  $('#tumblr-quote').on('click', function() {
    
    iJS.animate($('.quote-box')[0], "pulse") ;
    if(!inIframe()) {
      openURL('https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='+encodeURIComponent(currentAuthor)+'&content=' + encodeURIComponent(currentQuote));
    }
  });
  
  iJS.animate("with-love", "zoom-in", -1) ;
});
