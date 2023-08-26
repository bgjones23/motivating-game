document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 25,
        size: 20,
        speed: 2,
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

    var timer = 100;
    var internalGameClock = 0;
    var wave = 1;
    var speedIncreaseFactor = 1.1; // 10% faster

    var moveDirection = {
        left: false,
        right: false,
    };

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            update();
        }

        var touch = e.touches[0];
        if (touch.clientX < player.x) {
            moveDirection.left = true;
        } else {
            moveDirection.right = true;
        }
    });

    document.addEventListener('touchend', function(e) {
        moveDirection.left = false;
        moveDirection.right = false;
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({x, y, size, color: "red"});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = canvas.width / 2;
        player.y = canvas.height - 25;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
        timer = 100;
        internalGameClock = 0;
        wave = 1;
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

        internalGameClock++;

        // Update player position based on touch input
        if (moveDirection.left) {
            player.x -= player.speed;
        }
        if (moveDirection.right) {
            player.x += player.speed;
        }

        // Keep player within canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;

        // Draw player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Draw obstacles and check for collisions
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Collision check
            if (collisionDetected(player, obs)) {
                if (obs.color === "red") {
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
            }
        }

        // Display timer
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 25);

        // Display copyright text
        ctx.textAlign = "left";
        ctx.fillText("Copyright 2023", 10, canvas.height - 10);
        ctx.textAlign = "right";
        ctx.fillText("Created by Semper Ads...Always Be Advertising!", canvas.width - 10, canvas.height - 10);

        // Spawn new obstacles every 2 seconds
        if (internalGameClock % 20 === 0) spawnObstacle();

        // Increase difficulty every 10 seconds
        if (internalGameClock % 100 === 0) {
            timer -= 10;
            if (internalGameClock % 300 === 0 && wave % 3 === 0) {
                obstacles.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20, color: "purple" });
            }
            wave++;
        }

        // Request next animation frame
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the initial state
    update();
});
