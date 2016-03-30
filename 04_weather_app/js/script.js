/* Take from iJS-ui
--------------------*/

//permet d'afficher les notifications
function showNotification( msg,  mode ) {

  var notify = document.getElementById("notify-block") ;

  if( ! notify ) {

    notify = document.createElement('p') ;
    notify.id = "notify-block" ;

    document.body.appendChild( notify ) ;

  } else clearTimeout( window.i_event_notify_id ) ; //utile s'il y a eu d'autre notification avant.

  notify.style.display = "none" ; //on se rassure que la zone sera invisible avant l'affichage du msg
  notify.innerHTML = msg ;

  var closeButton = document.createElement("button");
  closeButton.className = "b-dialog-close";
  closeButton.innerHTML = "X";
  closeButton.onclick = function () {

    document.body.removeChild( notify ) ;
  } ;
  notify.appendChild( closeButton ) ;

  notify.style.display = "block" ; //affiche du msg
  notify.className = "notify-normal" ;

  //le mode en principe est soit "normal" soit "warring"
  //cependant n'importe quel valeur sauf "warring" peut convernir pour un mode d'affichage normal.
  if( mode === "warring") {

    notify.className = "notify-warring" ;
    window.i_event_notify_id = setTimeout( function(){ document.body.removeChild( notify ) ; }, 20000) ; //on cache la zone après 30s

  } else if( mode === "error") {

    notify.className = "notify-error" ;
    window.i_event_notify_id = setTimeout( function(){ document.body.removeChild( notify ) ; }, 25000) ; //on cache la zone après 30s

  }
  else if( mode === "success") {

    notify.className = "notify-success" ;
    window.i_event_notify_id = setTimeout( function(){ document.body.removeChild( notify ) ; }, 25000) ; //on cache la zone après 30s

  } else window.i_event_notify_id = setTimeout( function(){ document.body.removeChild( notify ) ; }, 15000) ; //on cache la zone après 15s

}
