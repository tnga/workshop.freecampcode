/* Original AI by : MutantSpore <http://codepen.io/MutantSpore>
 * Adjust, little clean and perform by : tnga <https://github.com/tnga>
*/

$(document).ready( function() {
  
    var squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var used = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var X_token = "<i class='fa fa-times'></i>";
    var O_token = "<i class='fa fa-circle-o'></i>";
    var humanPlayer = X_token;
    var aiPlayer = O_token;
    var empty = 0;
    var human = 1;
    var ai = 2;
    var hasMoved = false;
    var gameOver = false;
    var how = [];
    var score = [0, 0, 0];
    var delay;
    var move = {};
    var moveCounter = 0;
    var score_TIE = 1;
    var score_HUMAN = 0;
    var score_AI = 2;
    var outcome = null;
    var gameLevel = "easy";
    var enableSound = true;


    var board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    var win = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];



    var humanSound = new Audio('sounds/trained.mp3');
    var aiSound = new Audio('sounds/knob.mp3');
    var humanWinSound = new Audio('sounds/applause.mp3');
    var aiWinSound = new Audio('sounds/babanana-mini.mp3');
    var nullWinSound = new Audio('sounds/discreet-song.mp3');
    var easySound = new Audio('sounds/early-sunrise-song.mp3');
    var hardSound = new Audio('sounds/mission-impossible.mp3');
    
    easySound.loop = true ;
    hardSound.loop = true ;



    function setNewGame () {
        
        squares.forEach( function (v) {
            $('#b-' + v).empty();
            $('#b-' + v).removeClass('semi-display');
        });

        board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        hasMoved = false;
        outcome = null;
        moveCounter = 0;
        gameOver = false;
        how = [];
        move = {};
    }


    function playSound (sound) {
        
        if (enableSound) sound.play();
    }


    function moveHUMAN (here) {
        
        if (!(board[here.x][here.y])) {
            board[here.x][here.y] = human;
            playSound( humanSound );
            drawMove(here, humanPlayer, 100);
            hasMoved = true;
        }
    }


    function moveAI_Rnd () {
        
        var min = Math.min.apply(null, board.reduce(function(a, b) {
            return a.concat(b);
        }, []));

        var whereMove = {};

        if (min === 0) {
            while (!(hasMoved)) {
                whereMove.x = Math.floor(Math.random() * 3);
                whereMove.y = Math.floor(Math.random() * 3);
                if (!(board[whereMove.x][whereMove.y])) {
                    board[whereMove.x][whereMove.y] = ai;
                    drawMove(whereMove, aiPlayer, 300);
                    playSound( aiSound );
                    hasMoved = true;
                }
            }
        }
    }




    function moveAI_Wiki () {

        // transfer board to used
        used = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var corner = [0, 2, 6, 8];
        var side = [1, 3, 5, 7];
        var count = 0;
        var theMove = null;
        for (var row = 0; row <= 2; row++) {
            for (var col = 0; col <= 2; col++) {
                used[count] = board[row][col];
                count++;
            }
        }

        function move () {
            
            var whereMove = {};
            whereMove.x = parseInt(theMove / 3);
            whereMove.y = theMove % 3;
            board[whereMove.x][whereMove.y] = ai;
            drawMove(whereMove, aiPlayer, 300);
            playSound( aiSound );
            hasMoved = true;
            moveCounter++;
        }


        // opening move
        function opening () {
            
            if (theMove === null && (used[1] === human || used[3] === human)) {
                theMove = 0;
                move();
            }

            if (theMove === null && (used[5] === human || used[7] === human)) {
                theMove = 8;
                move();
            }

            if (used[4] === human && theMove === null) {
                emptyCorner();
                return;
            }

            if (used[4] === empty && theMove === null && moveCounter === 0 && aiPlayer === X_token) {
                theMove = corner[Math.floor(Math.random() * 4)];
                move();
            }

            if (used[4] === empty && theMove === null) {
                playCenter();
                return;
            }
        }


        // look for a win
        function aWin () {
            
            win.forEach( function (solution) {
                if ((used[solution[0]] === ai && used[solution[1]] === ai && used[solution[2]] == empty) ||
                    (used[solution[0]] === ai && used[solution[1]] === empty && used[solution[2]] == ai) ||
                    (used[solution[0]] === empty && used[solution[1]] === ai && used[solution[2]] == ai)) {

                    solution.forEach( function (pos) {
                        if (used[pos] === empty && theMove === null) {
                            theMove = pos;
                        }
                    });
                    move();
                }
            });
        }


        // look for a block
        function block () {
            
            if (used[4] === empty && theMove === null) {
                playCenter();
                return;
            }

            win.forEach( function (solution) {
                if ((used[solution[0]] === human && used[solution[1]] === human && used[solution[2]] == empty) ||
                    (used[solution[0]] === human && used[solution[1]] === empty && used[solution[2]] == human) ||
                    (used[solution[0]] === empty && used[solution[1]] === human && used[solution[2]] == human)) {

                    solution.forEach( function (pos) {
                        if (used[pos] === empty && theMove === null) {
                            theMove = pos;
                        }
                    });
                    move();
                }
            });
        }


        // make fork
        function fork () {
            
            win.forEach( function (solution) {
                if ((used[solution[0]] === ai && used[solution[1]] === empty && used[solution[2]] == empty) ||
                    (used[solution[0]] === empty && used[solution[1]] === empty && used[solution[2]] == ai) ||
                    (used[solution[0]] === empty && used[solution[1]] === ai && used[solution[2]] == empty)) {

                    if (used[4] === ai &&
                        (([used[0] === human] && used[8] === human) || ([used[2] === human] && used[6] === human))) {
                        side.forEach( function (pos) {
                            if (used[pos] === empty && theMove === null) {
                                theMove = pos;
                            }
                        });
                    } else {
                        corner.forEach( function (pos) {
                            if (used[pos] === empty && theMove === null) {
                                theMove = pos;
                            }
                        });
                    }
                    move();
                }
            });
        }


        // block fork
        function blockFork () {
            
            if (moveCounter > 1 && used[4] !== empty && theMove === null) {
                emptySide();
                return;
            }

            win.forEach( function (solution) {
                if ((used[solution[0]] === human && used[solution[1]] === empty && used[solution[2]] == empty) ||
                    (used[solution[0]] === empty && used[solution[1]] === empty && used[solution[2]] == human) ||
                    (used[solution[0]] === empty && used[solution[1]] === human && used[solution[2]] == empty)) {

                    side.forEach( function (pos) {
                        if (used[pos] === empty && theMove === null) {
                            theMove = pos;
                        }
                    });
                    move();
                }
            });
        }


        // play center
        function playCenter () {
            
            if (used[4] === empty && theMove === null) {
                theMove = 4;
                move();
            }
        }


        // opposite corner
        function oppositeCorner () {
            
            if (used[0] === human && used[8] === empty && theMove === null) {
                theMove = 8;
                move();
            } else if (used[0] === empty && used[8] === human && theMove === null) {
                theMove = 0;
                move();
            } else if (used[2] === human && used[6] === empty && theMove === null) {
                theMove = 6;
                move();
            } else if (used[2] === empty && used[6] === human && theMove === null) {
                theMove = 2;
                move();
            }
        }


        // empty corner
        function emptyCorner () {
            
            corner.forEach( function (pos) {
                if (used[pos] === empty && theMove === null) {
                    theMove = pos;
                    move();
                }
            });
        }


        //empty side
        function emptySide () {
            
            side.forEach( function (pos) {
                if (used[pos] === empty && theMove === null) {
                    theMove = pos;
                    move();
                }
            });
        }


        //based on wikipedia solution
        // https://en.wikipedia.org/wiki/Tic-tac-toe

        //0. opening move
        if (theMove === null && moveCounter === 0) {
            opening();
        }

        //1. Win
        if (theMove === null) {
            aWin();
        }

        //2. Block
        if (theMove === null) {
            block();
        }

        //3. Fork
        if (theMove === null) {
            fork();
        }

        //4. Block Fork
        if (theMove === null) {
            blockFork();
        }

        //5. Center
        if (theMove === null) {
            playCenter();
        }

        //6. Opposite corner
        if (theMove === null) {
            oppositeCorner();
        }

        //7. Empty corner
        if (theMove === null) {
            emptyCorner();
        }

        //8. Empty side
        if (theMove === null) {
            emptySide();
        }
    }



    function drawMove (location, who, delay) {
        
        setTimeout( function () {
            $('#b-' + (location.x * 3 + location.y)).html("<span class='who valign center-align animated fadeIn'>" + who + "</span>");
        }, delay);
    }


    function checkStatus () {

        var min = Math.min.apply(null, board.reduce(function(a, b) {
            return a.concat(b);
        }, []));

        [ai, human].forEach( function (player) {
            win.forEach( function (solution) {
                var check = 0;
                solution.forEach( function (pos) {
                    if (board[parseInt(pos / 3)][pos % 3] === player) {
                        check++;
                    }
                });
                if (check === 3) {
                    if (player === ai) {
                        outcome = score_AI;
                        gameOver = true;
                        how = solution;
                        score[score_AI]++;
                    } else {
                        outcome = score_HUMAN;
                        gameOver = true;
                        how = solution;
                        score[score_HUMAN]++;
                    }
                }
            });
        });

        // if no moves left to make it's a draw
        if (min !== 0 && !gameOver) {
            hasMoved = true;
            gameOver = true;
            outcome = score_TIE;
            score[score_TIE]++;
            return;
        }
    }



    function showWin () {
        
        console.log( gameOver, outcome, how);
        how.forEach( function (v) {
            $('#b-' + v).addClass("semi-display");
            iJS.animate('b-' + v, "zoom-in") ;
        });
    }


    function updateScore () {
        
        score.forEach( function (count, i) {
            $('#score-' + i +'>span').text(count);
            iJS.animate('score-' + i, "pulse") ;
        });
        
        iJS.animate($("#display >dialog")[0], "bounce-in") ;
        //$("#display >dialog").css("display", "block") ;
        $('input[name="level"], input[name="weapon"]').attr("disabled", false) ;
        
        $("#display >dialog >i").removeClass() ;
        if (outcome === 0) {
            $("#display >dialog >i").addClass("fa fa-smile-o") ;
            $("#info-winner").text("user toe!") ;
            iJS.animate("info-winner", "rubberband", 2) ;
            playSound( humanWinSound );
        }
        if (outcome === 1) {
            $("#display >dialog >i").addClass("fa fa-hand-stop-o") ;
            $("#info-winner").text("null toe!") ;
            iJS.animate("info-winner", "wobble", 2) ;
            playSound( nullWinSound );
        }
        if (outcome === 2) {
            $("#display >dialog >i").addClass("fa fa-eye") ;
            $("#info-winner").text("machine toe!") ;
            iJS.animate("info-winner", "shake", 2) ;
            playSound( aiWinSound );
        }
        
        iJS.animate($("#display >dialog >i.fa")[0], "bounce") ;

        iJS.animate('score-' + outcome, "jello") ;
    }


    function control () {

        if (aiPlayer === X_token && moveCounter === 0) {
            hasMoved = false;
            if (gameLevel === "easy") 
                moveAI_Rnd() ;
            else
                moveAI_Wiki();
            checkStatus();
        }

        $('#display').on('click', '.grid', (function() {

            hasMoved = false;

            if (!hasMoved && !gameOver) {
                move.x = parseInt($(this).attr('id').split('-')[1] / 3);
                move.y = $(this).attr('id').split('-')[1] % 3;
                moveHUMAN(move);
                checkStatus();
            }

            if (hasMoved && !gameOver) {
                hasMoved = false;
                if (gameLevel === "easy") 
                    moveAI_Rnd() ;
                else
                    moveAI_Wiki();
                checkStatus();
            }

            if (hasMoved && gameOver) {
                showWin();
                setTimeout( updateScore, 2500) ;
            }
        }));

    }



    $('input[name="weapon"][value="x"]').click(function() {
        humanPlayer = X_token;
        aiPlayer = O_token;
    });
    $('input[name="weapon"][value="o"]').click(function() {
        humanPlayer = O_token;
        aiPlayer = X_token;
    });
    
    $('input[name="level"]').on("change", function() {
        gameLevel = this.value ;
        if (this.value === "easy") {
            playSound( easySound );
            hardSound.pause() ;
        }
        else {
            playSound( hardSound );
            easySound.pause() ;
        }
    });
    
    $('input[name="sound"]').on("change", function() {
        if (!this.checked) {
            if (gameLevel === "easy") 
                easySound.pause() ;
            else
                hardSound.pause() ;
            enableSound = false ;
        }
        else {
            enableSound = true ;
            if (gameLevel === "easy") 
                playSound( easySound ) ;
            else
                playSound( hardSound ) ;
        }
    });

    $('#display >dialog').click(function() {
        
        $('input[name="level"], input[name="weapon"]').attr("disabled", true) ;
        
        setNewGame();
        control();
        
        var hideDialog = iJS.animate(this, "bounce-out") ;
        hideDialog.onfinish = function () {
         
            squares.forEach(function(v) {
                iJS.animate('b-' + v, "flip-in-x") ;
                $("#b-" + v).mouseover( function() {
                    iJS.animate(this, "pulse") ;
                }) ;
            });
        };
        //$(this).css("display", "none") ;
    });
    
    iJS.animate($(".i-block.sb-style")[0], "fade-in-down") ;
    iJS.animate("footer", "fade-in-up") ;
    iJS.animate("display", "fade-in") ;
    iJS.animate("with-love", "zoom-in", -1) ;
    playSound( easySound );
  
});
