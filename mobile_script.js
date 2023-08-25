document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: 50,
        y: canvas.height - 25,
        size: 20,
        dx: 5,
        dy: 5
    };

    var obstacles = [];
    var timer = 100;
    var gameClock = 0;
    var wave = 1;
    var gameStarted = false;
    var moveDirection = null;

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

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            setInterval(updateGameClock, 1000);
            update();
        }

        var touch = e.touches[0];
        moveDirection = touch.clientX < canvas.width / 2 ? 'left' : 'right';

        // Check for up or down touch
        if (touch.clientY < canvas.height / 2) {
            moveDirection = 'up';
        } else {
            moveDirection = 'down';
        }
    });

    document.addEventListener('touchend', function(e) {
        moveDirection = null;
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({x, y, size});
    }

    function spawnPurpleObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({x, y, size, color: "purple"});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
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
        player.x = 50;
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
            ctx.fillText("Tap left, right, up, or down to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        // Move player
        if (moveDirection === 'left') player.x -= player.dx;
        if (moveDirection === 'right') player.x += player.dx;
        if (moveDirection === 'up') player.y -= player.dy;
        if (moveDirection === 'down') player.y += player.dy;

        // Keep player within canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

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
                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

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
            if (Math.random() < 0.1) {
                spawnPurpleObstacle();
            } else {
                spawnObstacle();
            }
        }

        // Draw timer and wave
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width - 120, 10, 110, 30);
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Time: ${timer}s`, canvas.width - 15, 30);
        ctx.fillText(`Wave: ${wave}`, canvas.width - 15, 50);

        // Request next animation frame
        requestAnimationFrame(update);
    }

    // Start the initial state
    update();
});
