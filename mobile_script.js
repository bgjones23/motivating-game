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
        dy: 0
    };

    var points = 0;
    var timer = 100;
    var wave = 1;
    var highScore = localStorage.getItem('highScore') || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var waveInterval = 10;
    var difficultyIncreaseInterval = 30;
    var maxWaves = 10;
    var speedIncreaseFactor = 1.1;

    var motivationalMessages = [
        "keep after it", "you got this", "don't stop now", "believe", "you can do it",
        "move faster", "let's go", "let's gooo", "let's goooooo", "almost!", "so close!",
        "keep going", "nation!", "sweet", "motivate, or else", "time to go", "get it",
        "snap!", "sampsonite!", "c'mon!", "almoooooost!", "in a world...", "if not who but us?",
        "if not now, then when?", "are you not entertained?!?", "seriously?", "dude.", "duuuuuuude.",
        "dude", "DUDE!", "you do nice work.", "noice", "realllly noice", "woah...", "wooooooahh...",
        "c'mon man!", "are you motivated yet?", "pineapple"
    ];

    var joystick = {
        x: canvas.width / 2,
        y: canvas.height - 60,
        outerRadius: 40,
        innerRadius: 20,
        touchId: null,
        touchStartX: null,
        touchStartY: null
    };

    function displayCopyright() {
        ctx.fillStyle = "black";
        ctx.font = "10px Futura";
        ctx.textAlign = "left";
        ctx.fillText("©2023 Semper Ads", 10, canvas.height - 10);

        ctx.textAlign = "right";
        ctx.fillText("emotional advertising", canvas.width - 10, canvas.height - 10);
    }

    function startGame() {
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
                waveInterval--;
                difficultyIncreaseInterval--;

                if (timer % 10 === 0 && waveInterval <= 0) {
                    wave++;
                    waveInterval = 10;
                }

                if (wave <= maxWaves && difficultyIncreaseInterval <= 0) {
                    speedIncreaseFactor += 0.1;
                    difficultyIncreaseInterval = 30;
                }
            } else {
                gameOver = true;
                clearInterval(timerInterval);
                resetGame();
            }
        }, 1000);
        update();
    }

    canvas.addEventListener("touchstart", function(event) {
        if (!gameStarted) {
            startGame();
        } else {
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                var rect = canvas.getBoundingClientRect();
                var touchX = touch.clientX - rect.left;
                var touchY = touch.clientY - rect.top;
                if (Math.hypot(touchX - joystick.x, touchY - joystick.y) < joystick.outerRadius) {
                    joystick.touchId = touch.identifier;
                    joystick.touchStartX = touchX;
                    joystick.touchStartY = touchY;
                }
            }
        }
    });

    canvas.addEventListener("touchmove", function(event) {
        if (gameStarted && !gameOver && joystick.touchId !== null) {
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                if (touch.identifier === joystick.touchId) {
                    var rect = canvas.getBoundingClientRect();
                    var touchX = touch.clientX - rect.left;
                    var touchY = touch.clientY - rect.top;

                    var deltaX = touchX - joystick.touchStartX;
                    var deltaY = touchY - joystick.touchStartY;

                    var distance = Math.hypot(deltaX, deltaY);
                    if (distance > joystick.outerRadius - joystick.innerRadius) {
                        deltaX = (deltaX / distance) * (joystick.outerRadius - joystick.innerRadius);
                        deltaY = (deltaY / distance) * (joystick.outerRadius - joystick.innerRadius);
                    }

                    player.dx = deltaX * 0.1;
                    player.dy = deltaY * 0.1;

                    break;
                }
            }
        }
    });

    canvas.addEventListener("touchend", function(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === joystick.touchId) {
                joystick.touchId = null;
                joystick.touchStartX = null;
                joystick.touchStartY = null;
                player.dx = 0;
                player.dy = 0;
                break;
            }
        }
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        var type = Math.random();
        var color;
        if (type < 0.9) color = "red";
        else if (type < 0.98) color = "purple";
        else color = "gold";
        obstacles.push({x, y, size, color});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }

    function updateHighScore() {
        if (points > highScore) {
            highScore = points;
            localStorage.setItem('highScore', highScore);
        }
    }

    function resetGame() {
        player.x = canvas.width / 2;
        player.y = canvas.height - 65;
        obstacles = [];
        points = 0;
        timer = 100;
        wave = 1;
        speedIncreaseFactor = 1.1;
        gameOver = false;
        gameStarted = false;
        clearInterval(timerInterval);
        update();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Futura";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            return;
        }

        player.x += player.dx * speedIncreaseFactor;
        player.y += player.dy * speedIncreaseFactor;

        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            if (collisionDetected(player, obs)) {
                if (obs.color === "red") {
                    gameOver = true;
                    clearInterval(timerInterval);

                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillStyle = "black";
                    ctx.font = "24px Montserrat";
                    ctx.textAlign = "center";
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                    updateHighScore();
                    setTimeout(resetGame, 2000);
                    return;

                } else if (obs.color === "gold") {
                    points += 10;
                    obstacles.splice(i, 1);
                    i--;

                } else if (obs.color === "purple") {
                    timer += 5;
                    obstacles.splice(i, 1);
                    i--;
                }
            }
        }

        ctx.fillStyle = "black";
        ctx.font = "16px Montserrat";
        ctx.textAlign = "right";
        ctx.fillText(`Points: ${points}`, canvas.width - 10, 25);
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 50);
        ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 75);
        ctx.fillText(`Wave: ${wave}`, canvas.width - 10, 100);

        if (Math.random() < 0.05) spawnObstacle();

        displayCopyright();

        // Draw joystick
        ctx.beginPath();
        ctx.arc(joystick.x, joystick.y, joystick.outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(joystick.x, joystick.y, joystick.innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fill();

        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    update();
});
