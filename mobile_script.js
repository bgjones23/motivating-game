document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 25,
        size: 20,
        dx: 0,
        dy: 0,
        speed: 5
    };

    var obstacles = [];
    var timer = 100;
    var gameClock = 0;
    var wave = 1;
    var gameStarted = false;
    var joystickRadius = 30;

    var speedIncreaseFactor = 1.1; // 10% faster
    var obstacleSpawnRate = 0.05;
    var obstacleIncreaseFactor = 1.1; // 10% more obstacles every 3rd wave

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

    function calculateDirection(angle) {
        var direction = { dx: 0, dy: 0 };

        if (angle >= 45 && angle < 135) direction.dy = -1; // Up
        else if (angle >= 135 && angle < 225) direction.dx = -1; // Left
        else if (angle >= 225 && angle < 315) direction.dy = 1; // Down
        else direction.dx = 1; // Right

        return direction;
    }

    function getAngle(x, y) {
        return (Math.atan2(y, x) * 180) / Math.PI;
    }

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({ x, y, size });
    }

    function spawnPurpleObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({ x, y, size, color: "purple" });
    }

    function collisionDetected(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y
        );
    }

    function updateGameClock() {
        gameClock++;
        if (gameClock % 10 === 0) {
            // New wave every 10 seconds
            wave++;
            if (wave % 3 === 0) {
                obstacleSpawnRate *= obstacleIncreaseFactor;
            }
            console.log("New wave: " + wave);
        }
    }

    function resetGame() {
        player.x = canvas.width / 2;
        player.y = canvas.height - 25;
        obstacles = [];
        timer = 100;
        gameClock = 0;
        wave = 1;
        gameStarted = false;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText(
                "Move the joystick to control the blue square",
                canvas.width / 2,
                canvas.height / 2 + 30
            );
            return;
        }

        var joystickX = player.x + player.size / 2 + player.dx * joystickRadius;
        var joystickY = player.y + player.size / 2 + player.dy * joystickRadius;

        // Draw joystick
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(joystickX, joystickY, joystickRadius, 0, Math.PI * 2);
        ctx.fill();

        // Move player
        player.x += player.dx * player.speed;
        player.y += player.dy * player.speed;

        // Keep player within canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width)
            player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height)
            player.y = canvas.height - player.size;

        // Draw player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Draw obstacles
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillStyle = obs.color || "red";
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Check for collisions
            if (collisionDetected(player, obs)) {
                if (obs.color === "purple") {
                    timer += 10;
                } else {
                    gameOver = true;

                    // Display a random motivational message
                    ctx.fillStyle = "black";
                    ctx.font = "30px Arial";
                    ctx.textAlign = "center";
                    var randomMessage =
                        motivationalMessages[
                            Math.floor(Math.random() * motivationalMessages.length)
                        ];
                    ctx.fillText(
                        randomMessage,
                        canvas.width / 2,
                        canvas.height / 2
                    );

                    // Reset the game after 2 seconds
                    setTimeout(resetGame, 2000);
                    return;
                }
                obstacles.splice(i, 1);
                i--;
            }
        }

        // Spawn new obstacles
        if (Math.random() < obstacleSpawnRate) {
            if (wave % 3 === 0) {
                spawnPurpleObstacle();
            } else {
                spawnObstacle();
            }
        }

        // Draw score and timer
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.fillText("Time: " + timer + "s", canvas.width - 10, 30);
        ctx.fillText("Wave: " + wave, canvas.width - 10, 60);

        // Update game clock
        updateGameClock();

        // Request next animation frame
        requestAnimationFrame(update);
    }

    // Add joystick controls
    canvas.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        var angle = getAngle(
            touch.clientX - player.x - player.size / 2,
            touch.clientY - player.y - player.size / 2
        );
        var direction = calculateDirection(angle);
        player.dx = direction.dx;
        player.dy = direction.dy;
    });

    canvas.addEventListener("touchend", function () {
        player.dx = 0;
        player.dy = 0;
    });

    // Start the initial state
    update();
});
