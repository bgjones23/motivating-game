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

    var motivationalMessages = [ "keep after it",
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
        "you can do it",
        "fiddlesticks",
        "chicken wing",
        "pineapple"
    ];

    function startGame() {
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                resetGame();
            }
        }, 1000);
        spawnObstacle();
        update();
    }

    function spawnObstacle() {
        var type;
        var rand = Math.random();
        if (rand < 0.03) {
            type = 'gold';
        } else if (rand < 0.08) {
            type = 'purple';
        } else {
            type = 'red';
        }

        var obstacle = {
            x: Math.random() * canvas.width,
            y: 0,
            size: 20,
            dy: 2,
            type: type,
        };

        obstacles.push(obstacle);
        setTimeout(spawnObstacle, 1000);
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
        player.dx = (deltaX > 0) ? player.speed : -player.speed;
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
            return;
        }
        movePlayer();
        drawPlayer();
        updateObstacles();
        drawObstacles();
        checkCollisions();
        displayGameInfo();
        requestAnimationFrame(update);
    }

    function movePlayer() {
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width) player.x = canvas.width;
    }

    function drawPlayer() {
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    }

    function updateObstacles() {
        obstacles.forEach(obstacle => {
            obstacle.y += obstacle.dy;
        });
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            ctx.fillStyle = (obstacle.type === 'gold') ? 'gold' : (obstacle.type === 'purple') ? 'purple' : 'red';
            ctx.fillRect(obstacle.x - obstacle.size / 2, obstacle.y - obstacle.size / 2, obstacle.size, obstacle.size);
        });
    }

    function checkCollisions() {
        obstacles.forEach((obstacle, index) => {
            if (
                player.x < obstacle.x + obstacle.size &&
                player.x + player.size > obstacle.x &&
                player.y < obstacle.y + obstacle.size &&
                player.y + player.size > obstacle.y
            ) {
                switch (obstacle.type) {
                    case 'gold':
                        points++;
                        break;
                    case 'purple':
                        timer += 10;
                        break;
                    case 'red':
                        gameOver = true;
                        clearInterval(timerInterval);
                        resetGame();
                        return;
                }
                obstacles.splice(index, 1);
            }
        });
    }

    function displayGameInfo() {
        ctx.fillStyle = "black";
        ctx.font = "16px Futura";
        ctx.textAlign = "left";
        ctx.fillText(`Points: ${points}`, 10, 20);
        ctx.fillText(`Time: ${timer}s`, 10, 40);
        ctx.fillText(`High Score: ${highScore}`, 10, 60);
        if (gameOver) {
            ctx.fillText(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)], 10, 100);
        }
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
    }

    update();
});
