/**
*             SIMON GAME
*         for freeCodeCamp.com
*        thanks to EmAnt - 2015
* by tnga <http://freeCodeCamp.com/tnga> - 2016
*
*     Simple Game using CSS3, jQuery & iJS
*
***********************************************
* !!! It uses the new Web Audio API !!!
* You Need an up-to-date browser.
* Tested on Firefox, Chrome, Safari
***********************************************
*
* @TODO add input to enable user to set melodies length sequence (from 10 to infinity; defautl: 20)
*/


$(document).ready( function () {

    // Checking for Web Audio API on your browser ...
    var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

    if (!AudioContext) {

        // Sorry, but the game won't work for you
        alert('Sorry, but the Web Audio API is not supported by your browser.'
              + ' Please, consider downloading the latest version of '
              + 'Google Chrome or Mozilla Firefox');

    } else {

        // You can play the game !!!!
        var audioCtx = new AudioContext();

        var frequencies = [329.63,261.63,220,164.81];

        var errOsc = audioCtx.createOscillator();
        errOsc.type = 'triangle';
        errOsc.frequency.value = 110;
        errOsc.start(0.0); //delay optional parameter is mandatory on Safari
        var errNode = audioCtx.createGain();
        errOsc.connect( errNode );
        errNode.gain.value = 0;
        errNode.connect( audioCtx.destination );

        var ramp = 0.1;
        var vol = 0.5;

        var gameStatus = {};
        
        gameStatus.winCount = 0 ;

        gameStatus.reset = function () {
            
            this.init();
            this.strict = false;
        }

        gameStatus.init = function () {
            
            this.lastPush = $('#bs-0');
            this.sequence = [];
            this.tStepInd = 0;
            this.index = 0;
            this.count = 0;
            this.lock = false;
        };

        // create Oscillators
        var oscillators = frequencies.map( function (frq) {
            
            var osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = frq;
            osc.start(0.0); //delay optional parameter is mandatory on Safari
            return osc;
        });

        var gainNodes = oscillators.map( function (osc) {
            
            var g = audioCtx.createGain();
            osc.connect( g );
            g.connect( audioCtx.destination );
            g.gain.value = 0;
            return g;
        });


        function playGoodTone (num) {
            
            gainNodes[num].gain
                .linearRampToValueAtTime( vol, audioCtx.currentTime + ramp);
            gameStatus.currPush = $('#bs-'+num);
            gameStatus.currPush.addClass('hovered');
            iJS.animate('bs-'+num, "pulse") ;
        };

        function stopGoodTones () {
            
            if (gameStatus.currPush)
                gameStatus.currPush.removeClass('hovered');
            gainNodes.forEach( function (g) {
                g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ramp);
            });
            gameStatus.currPush = undefined;
            gameStatus.currOsc = undefined;
        };

        function playErrTone () {
            
            errNode.gain.linearRampToValueAtTime( vol, audioCtx.currentTime + ramp);
        };

        function stopErrTone () {
            
            errNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ramp);
        };

        function gameStart () {
            
            resetTimers();
            stopGoodTones();
            stopErrTone();
            $('#m-count').text('0') ;
            gameStatus.init();
            addStep();
        }

        function setTimeStep (num) {
            
            var tSteps = [1250 , 1000 , 750, 500 ];
            if (num < 4)
                return tSteps[0];
            if (num < 8)
                return tSteps[1];
            if (num < 12)
                return tSteps[2];
            return tSteps[3];
        }

        function notifyError (pushObj) {
            
            gameStatus.lock = true;
            $('#bs-0, #bs-1, #bs-2, #bs-3').addClass("unclickable") ;
            playErrTone();
            
            if (pushObj)
                pushObj.addClass('hovered');
            gameStatus.toHndl = setTimeout(function () {
                stopErrTone();
                if (pushObj)
                    pushObj.removeClass('hovered');
                gameStatus.toHndlSt = setTimeout( function () {
                    if (gameStatus.strict)
                        gameStart() ;
                    else
                        playSequence();
                },1000);
            },1000);
            
            flashMessage('oops!!!');
            iJS.animate('board', "jello") ;
        };

        function notifyWin () {
            
            var cnt = 0;
            var last = gameStatus.lastPush.attr('id').split("-")[1]; //id egg: bs-0
            gameStatus.seqHndl = setInterval( function () {
                playGoodTone( last );
                gameStatus.toHndl = setTimeout( stopGoodTones,80);
                cnt++;
                if (cnt === 8){
                    clearInterval( gameStatus.seqHndl);
                }
            },160);
            
            $("#win-count").text( ++gameStatus.winCount ) ;
            flashMessage('bravo!!!');
            iJS.animate('board', "tada") ;
        }

        function flashMessage (msg) {
            
            $('#info-winner').text(msg);
            iJS.animate('info-winner', "fade-in") ;
            clearTimeout( gameStatus.toHndlFl);
            gameStatus.toHndlFl = setTimeout( function () {
                iJS.animate('info-winner', "fade-out") ;
            }, 2500);
        }

        function displayCount () {
            
            var p = ( gameStatus.count < 10) ? '0' : '';
            $('#m-count').text( p+(gameStatus.count+''));
        }

        function playSequence () {
            
            var i = 0;
            gameStatus.index = 0;
            gameStatus.seqHndl = setInterval( function () {
                displayCount();
                gameStatus.lock = true;
                playGoodTone( gameStatus.sequence[i] );
                gameStatus.toHndl = setTimeout( stopGoodTones, gameStatus.timeStep/2 - 10);
                i++;
                if (i === gameStatus.sequence.length) {
                    clearInterval( gameStatus.seqHndl );
                    $('#bs-0, #bs-1, #bs-2, #bs-3').attr("disabled", false);
                    $('#bs-0, #bs-1, #bs-2, #bs-3').removeClass("unclickable");
                    gameStatus.lock = false;
                    gameStatus.toHndl = setTimeout( notifyError, 5*gameStatus.timeStep);
                }
            },gameStatus.timeStep);
        };

        function addStep () {
            
            gameStatus.timeStep = setTimeStep( gameStatus.count++);
            gameStatus.sequence.push( Math.floor(Math.random()*4));
            gameStatus.toHndl=setTimeout( playSequence, 500); //@NOTE 500 or higher is a good choice!
        };

        function resetTimers () {
            
            clearInterval( gameStatus.seqHndl );
            clearInterval( gameStatus.flHndl );
            clearTimeout( gameStatus.toHndl );
            clearTimeout( gameStatus.toHndlSt );
        };

        function pushColor (pushObj) {
            
            if (!gameStatus.lock) {
                clearTimeout( gameStatus.toHndl );
                var pushNr = pushObj.attr('id').split("-")[1]; //id egg `bs-0`
                if (pushNr == gameStatus.sequence[gameStatus.index]
                   && gameStatus.index < gameStatus.sequence.length) {

                    playGoodTone( pushNr );
                    gameStatus.lastPush = pushObj;
                    gameStatus.index++;
                    if (gameStatus.index < gameStatus.sequence.length) {
                        gameStatus.toHndl = setTimeout( notifyError, 5*gameStatus.timeStep);
                    }
                    else if (gameStatus.index == 20){
                        $('#bs-0, #bs-1, #bs-2, #bs-3').attr("disabled", true);
                        gameStatus.toHndl = setTimeout( notifyWin, gameStatus.timeStep);
                    }
                    else {
                        $('#bs-0, #bs-1, #bs-2, #bs-3').addClass("unclickable");
                        //@NOTE `playGoodTone` will start after 500ms, so set timeout below upto it (egg 100, 250, ...<500).
                        setTimeout( stopGoodTones, 300) ; 
                        addStep();
                    }
                }
                else {
                    notifyError( pushObj );
                }
            }
        }

        $('#bs-0, #bs-1, #bs-2, #bs-3').mousedown( function () {
            pushColor($(this));
        });

        $('#display *').mouseup( function (e) {
            e.stopPropagation();
            if(!gameStatus.lock)
                stopGoodTones();
        });


        function toggleStrict () {
            $('#mode-strict').toggleClass('hovered');
            gameStatus.strict = !gameStatus.strict;
        }

        $('#start').click( function() {
            
            $(this).addClass('hovered');
            $('#stop').removeClass('hovered');
            
            $('#mode-strict').click(toggleStrict);
            
            gameStart() ;
        });
        
        $('#stop').click( function() {
            
            gameStatus.reset();
            $('#m-count').text('0');
            $('#bs-0, #bs-1, #bs-2, #bs-3').attr("disabled", true) ;
            $('#start').removeClass('hovered');
            $('#mode-strict').off('click');
            $('#mode-strict').removeClass('hovered');
            $(this).addClass('hovered');
            resetTimers();
            stopGoodTones();
            stopErrTone();
        });

        gameStatus.reset();
        $('#bs-0, #bs-1, #bs-2, #bs-3').attr("disabled", true) ;
    }
    
    var animDisp = iJS.animate("display", "rotate-in") ;
    animDisp.onfinish = function () {
      
        $('#display >*').each( function (i) {
            if (this.id === "bs-0") iJS.animate(this, "fade-in-up") ;
            if (this.id === "bs-1") iJS.animate(this, "fade-in-right") ;
            if (this.id === "bs-2") iJS.animate(this, "fade-in-left") ;
            if (this.id === "bs-3") iJS.animate(this, "fade-in-down") ;
            if (this.id === "board") iJS.animate(this, "pulse") ; ;
        }) ;
    };
    
    iJS.animate("with-love", "zoom-in", -1) ;
});