document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        size: 20,
        speed: 5,
        dx: 0
    };

    var points = 0;
    var timer = 100;
    var highScore = localStorage.getItem('highScore') || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var internalGameClock = 0;
    var wave = 1;
    var waveIncreasingFactor = 1.1;
    var nextWaveThreshold = 3;

    var motivationalMessages = [
        "Motivate",
        "Keep after it",
        "You got this",
        "Don't stop now",
        "Believe",
        "You can do it",
        "Move faster next time",
        "Let's go",
        "Let's gooo",
        "Let's goooooo"
    ];

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            startGame();
        }

        var touch = e.touches[0];
        if (touch.clientX < player.x) player.dx = -player.speed;
        else player.dx = player.speed;
    });

    document.addEventListener('touchend', function() {
        player.dx = 0;
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        obstacles.push({ x, y: 0, size });
    }

    function collisionDetected(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y
        );
    }

    function updateHighScore() {
        if (points > highScore) {
            highScore = points;
            localStorage.setItem('highScore', highScore);
        }
    }

    function startGame() {
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
                internalGameClock++;

                if (internalGameClock % 10 === 0) {
                    if (internalGameClock / 10 === nextWaveThreshold) {
                        nextWaveThreshold += 3;
                        wave++;
                        obstacles = [];
                    }
                }

                if (internalGameClock % 10 === 0) {
                    spawnObstacle();
                }
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                updateHighScore();
                resetGame();
            }
        }, 1000);

        update();
    }

    function resetGame() {
        player.x = canvas.width / 2;
        obstacles = [];
        points = 0;
        timer = 100;
        internalGameClock = 0;
        wave = 1;
        gameStarted = false;
        clearInterval(timerInterval);
        update();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Tap left or right of blue square to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;

        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, canvas.height - 25, player.size, player.size);

        ctx.fillStyle = "red";
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            if (collisionDetected(player, obs)) {
                if (obs.color === "red") {
                    gameOver = true;
                    clearInterval(timerInterval);

                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillStyle = "black";
                    ctx.font = "40px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                    updateHighScore();
                    setTimeout(resetGame, 2000);
                    return;
                }
            }

            if (obs.y + obs.size > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Points: ${points}`, canvas.width - 10, 25);
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 50);
        ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 75);
        ctx.fillText(`Wave: ${wave}`, canvas.width - 10, 100);

        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    update();
});
