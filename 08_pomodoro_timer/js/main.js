$(document).ready( function () {
  
  $("#session-time, #break-time").on("change", function () {
    
    if (!runTimer) {
      
      this.value = parseInt( this.value.replace(/[^0-9]/g, "") ) ;
      if (this.value === "NaN") this.value = 0 ;
      if (sessionName === 'session') {
        
        sessionLength = parseInt( this.value ) ;
        timeLeft = sessionLength;
      } 
      if (sessionName === 'break!') {
       
        breakLength = parseInt( this.value ) ;
        timeLeft = breakLength;
      } 
      originalTime = timeLeft;
      secs = 60 * timeLeft;
    }
  }) ;
  
  $("#session-time").val( sessionLength ) ;
  $("#break-time").val( breakLength ) ;
  
  secs = 60 * $("#session-time").val() ;
  $("#display").on("click", toggleTimer) ;
  
  $("#i-progress-bar").click( function (e) { e.stopPropagation(); }) ;
  initProgressBar() ;
  
  iJS.animate("pomodoro", "slide-in-down") ;
}) ;


var breakLength = 5 ,
    sessionLength = 25 ,
    timeLeft = $("#session-time").val() ,
    fillHeight = '0%' ,
    sessionName = $("#pomodoro #display >h3").text() ,
    currentTotal ;

var runTimer = false ,
    secs = 60 * timeLeft ;
    originalTime = sessionLength ;

function secondsToDHMS (t) {
  t = Number(t);
  var d = Math.floor(t / 3600 / 24);
  var h = Math.floor(t / 3600 % 24);
  var m = Math.floor(t % 3600 / 60);
  var s = Math.floor(t % 3600 % 60);
  var l = Math.floor(t % 3600 % 60);
  return (
    {day : d , hour: (h<10)? "0"+h : h , min : (m<10)? "0"+m : m , sec : (s<10)? "0"+s : s , msec: l}
  ); 
}

// Change default session length
function sessionLengthChange (time) {
  if (!runTimer){
    if (sessionName === 'session') {
      sessionLength += time;
      if (sessionLength < 1) {
        sessionLength = 1;
      }
      $("#session-time").val( sessionLength ) ;
      timeLeft = sessionLength;
      originalTime = sessionLength;
      secs = 60 * sessionLength;
    }
  }
}

// Change default break length
function breakLengthChange (time) {
  if (!runTimer){
    breakLength += time;
    if (breakLength < 1) {
      breakLength = 1;
    }
    $("#break-time").val( breakLength ) ;
    if (sessionName === 'break!') {
      timeLeft = breakLength;
      originalTime = breakLength;
      secs = 60 * breakLength;
    }
  }
}

function toggleTimer () {
  
  if (!runTimer) {
    if (sessionName === "session") {
      currentLength = sessionLength;
    } 
    else {
      currentLength = breakLength;
    }

    updateTimer();
    runTimer = setInterval(updateTimer, 1000);
    $("#display").addClass("hovered") ;
    $("#session-time, #break-time").attr("readonly", true) ;
    iJS.animate("display", "pulse") ;
  } 
  else {
    clearInterval(runTimer);
    runTimer = false;
    $("#display").removeClass("hovered") ;
    $("#session-time, #break-time").attr("readonly", false) ;
    iJS.animate("display", "jello") ;
  }
}

function updateTimer () {
  secs -= 1;
  if (secs < 0) {
    // countdown is finished

    // Play audio
    var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
    var audio = new Audio(wav);
    audio.play();

    // toggle break and session
    if (sessionName === 'break!') {
      sessionName = 'session';
      $("#pomodoro #display >h3").text( sessionName ) ;
      currentLength = sessionLength;
      timeLeft = 60 * sessionLength;
      originalTime = sessionLength;
      secs = 60 * sessionLength;
    } 
    else {
      sessionName = 'break!';
      $("#pomodoro #display >h3").text( sessionName ) ;
      currentLength = breakLength;
      timeLeft = 60 * breakLength;
      originalTime = breakLength;
      secs = 60 * breakLength;
    }
  } 
  else {
    
    var otime = secondsToDHMS(secs); 
    $("#dis-min").text( otime.min ) ;
    $("#dis-sec").text( otime.sec ) ;
    //iJS.animate("dis-sec", "fade-in") ;
    if (otime.hour > 0) {
      $("#dis-hour").css("display", "inline") ;
      $("#dis-hour").text( otime.hour + " : ") ;
    } 
    else $("#dis-hour").css("display", "none") ;
    if (otime.day > 0) {
      $("#dis-day").css("display", "inline") ;
      $("#dis-day").text( otime.day + "d ") ;
    } 
    else $("#dis-day").css("display", "none") ;

    var denom = 60 * originalTime;
    var perc = Math.abs((secs / denom) * 100 - 100);
    $("#i-progress").css("width", perc + '%') ;
    iJS.animate("i-progress", "lightspeed") ;
    iJS.animate("display", "pulse") ;
  }
}


function initProgressBar () {

  var bar = document.getElementById('i-progress-bar'),
      _p_bar = document.getElementById('display'),
      slider = document.getElementById('i-progress'),
      sliderBtn = slider.firstElementChild ;
  var set_perc = 0 ;
    
  bar.addEventListener('mousedown', startSlide, false);
  bar.addEventListener('mouseup', stopSlide, false);

  function startSlide (event) {

    set_perc = ((event.clientX - (_p_bar.offsetLeft + bar.offsetLeft)) / bar.offsetWidth).toFixed(2);
    console.log( 'start' + set_perc + '%') ;
    bar.addEventListener('mousemove', moveSlide, false);
    bar.addEventListener('mouseout', stopSlide, false);
    slider.style.width = (set_perc * 100) + '%';
    updateCurrentTime () ;
  }

  function moveSlide (event) {

    set_perc = ((event.clientX - (_p_bar.offsetLeft + bar.offsetLeft)) / bar.offsetWidth).toFixed(2);
    set_perc = (set_perc * 100 >= 100) ? 1 : set_perc ; //prevent overflow
    set_perc = (set_perc * 100 <= 5) ? 0 : set_perc ; //considering the button width (~0.5% of progress bar)
    slider.style.width = (set_perc * 100) + '%';
    updateCurrentTime () ;

    if (set_perc * 100 >= 100) {
      
      stopSlide(event) ;
    }
  }

  function resetProgressBar () {

    bar.addEventListener('mousedown', startSlide, false);
    bar.addEventListener('mouseup', stopSlide, false);
    slider.style.width = "10%" ;
  }

  function stopSlide (event) {

    bar.removeEventListener('mousemove', moveSlide, false);
  }
  
  /*Depends of globals variables*/
  function updateCurrentTime () {
    
    if (!runTimer) {
    
      timeLeft = Math.abs( originalTime - originalTime * set_perc ) ;
      secs = 60 * timeLeft;
      var otime = secondsToDHMS(secs); 
      $("#dis-min").text( otime.min ) ;
      $("#dis-sec").text( otime.sec ) ;
      if (otime.hour > 0) {
        $("#dis-hour").css("display", "inline") ;
        $("#dis-hour").text( otime.hour + " : ") ;
      } 
      else $("#dis-hour").css("display", "none") ;
      if (otime.day > 0) {
        $("#dis-day").css("display", "inline") ;
        $("#dis-day").text( otime.day + "d ") ;
      } 
      else $("#dis-day").css("display", "none") ;
    }
  }
}