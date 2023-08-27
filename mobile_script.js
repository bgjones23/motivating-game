document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 360;
    canvas.height = 640;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 65,
        size: 20,
        speed: 5,
        dx: 0,
    };

    var touchX = null;
    var points = 0;
    var timer = 100;
    var highScore = parseInt(localStorage.getItem('highScore')) || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var messageTimeout;

    var motivationalMessages = [
        "keep after it",
        "you got this",
        "don't stop now",
        "believe",
        "you can do it",
        "move faster",
        "let's go",
        "let's gooo",
        "let's goooooo",
        "almost!",
        "so close!",
        "keep going",
        "nation!",
        "sweet",
        "motivate, or else",
        "time to go",
        "get it",
        "snap!",
        "sampsonite!",
        "c'mon!",
        "almoooooost!",
        "in a world...",
        "if not who but us?",
        "if not now, then when?",
        "are you not entertained?!?",
        "seriously?",
        "dude.",
        "duuuuuuude.",
        "dude",
        "DUDE!",
        "you do nice work.",
        "noice",
        "realllly noice",
        "woah...",
        "wooooooahh...",
        "c'mon man!",
        "are you motivated yet?",
        "pineapple"
    ];

    function startGame() {
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
            } else {
                endGame();
            }
        }, 1000);
        spawnObstacle();
        update();
    }

    function endGame() {
        gameOver = true;
        clearInterval(timerInterval);
        ctx.fillStyle = "black";
        ctx.font = "16px Futura";
        ctx.textAlign = "center";
        ctx.fillText(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)], canvas.width / 2, canvas.height / 2);
        messageTimeout = setTimeout(resetGame, 3000);
    }

    function spawnObstacle() {
        var type;
        var rand = Math.random();
        if (rand < 0.03) {
            type = 'gold';
        } else if (rand < 0.05) {
            type = 'purple';
        } else {
            type = 'red';
        }

        var obstacle = {
            x: Math.random() * canvas.width,
            y: 0,
            size: 20,
            dy: 4.5,  // Increased
            type: type,
        };

        obstacles.push(obstacle);
        setTimeout(spawnObstacle, 800);
    }

    document.addEventListener("touchstart", function(event) {
        if (!gameStarted) {
            startGame();
        } else {
            touchX = event.touches[0].clientX;
        }
    });

    document.addEventListener("touchmove", function(event) {
        var deltaX = event.touches[0].clientX - touchX;
        if (deltaX > 5) { 
            player.dx = player.speed;  // move right
        } else if (deltaX < -5) {
            player.dx = -player.speed;  // move left
        } else {
            player.dx = 0;  // don't move
        }
    });

    document.addEventListener("touchend", function() {
        touchX = null;
        player.dx = 0;
    });

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Futura";
            ctx.textAlign = "center";
            ctx.fillText("Touch to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Slide left or right to move", canvas.width / 2, canvas.height / 2 + 30);
        } else if (!gameOver) {
            movePlayer();
            drawPlayer();
            updateObstacles();
            drawObstacles();
            checkCollisions();
            displayGameInfo();
        }

        // Adding the copyright info
        ctx.fillStyle = "black";
        ctx.font = "10px Futura";
        ctx.textAlign = "left";
        ctx.fillText("©2023 Semper Ads", 10, canvas.height - 10);

        ctx.textAlign = "right";
        ctx.fillText("emotional advertising", canvas.width - 10, canvas.height - 10);

        requestAnimationFrame(update);
    }

    function movePlayer() {
        player.x += player.dx;

        // Ensure player doesn't move out of the canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    }

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    function updateObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += obstacles[i].dy;
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }
    }

    function drawObstacles() {
        for (let obstacle of obstacles) {
            if (obstacle.type === 'red') {
                ctx.fillStyle = 'red';
            } else if (obstacle.type === 'purple') {
                ctx.fillStyle = 'purple';
            } else if (obstacle.type === 'gold') {
                ctx.fillStyle = 'gold';
            }
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        }
    }

    function checkCollisions() {
        for (let obstacle of obstacles) {
            if (
                player.x < obstacle.x + obstacle.size &&
                player.x + player.size > obstacle.x &&
                player.y < obstacle.y + obstacle.size &&
                player.y + player.size > obstacle.y
            ) {
                if (obstacle.type === 'red') {
                    endGame();
                } else if (obstacle.type === 'purple') {
                    timer += 10;
                } else if (obstacle.type === 'gold') {
                    points++;
                }
                // Remove the obstacle once processed
                const index = obstacles.indexOf(obstacle);
                if (index > -1) {
                    obstacles.splice(index, 1);
                }
            }
        }
    }

    function displayGameInfo() {
        ctx.fillStyle = "black";
        ctx.font = "12px Futura";
        ctx.textAlign = "left";
        ctx.fillText("Points: " + points, 10, 20);
        ctx.fillText("Timer: " + timer, 10, 40);
        ctx.fillText("High Score: " + highScore, 10, 60);
    }

    function resetGame() {
        if (points > highScore) {
            highScore = points;
            localStorage.setItem('highScore', highScore);
        }
        points = 0;
        timer = 100;
        obstacles = [];
        gameStarted = false;
        gameOver = false;
        clearInterval(timerInterval);
    }

    update();
});
