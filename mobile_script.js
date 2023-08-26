document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: 50,
        y: canvas.height - 25,
        size: 20,
        dx: 5
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

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

    var moveDirection = null;

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            update();
        }

        var touch = e.touches[0];
        moveDirection = touch.clientX < canvas.width / 2 ? 'left' : 'right';
    });

    document.addEventListener('touchend', function(e) {
        moveDirection = null;
    });

    var timer = 100;
    var internalGameClock = 0;
    var wave = 1;
    var points = 0;
    var highScore = localStorage.getItem('highScore') || 0;

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({x, y, size});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = 50;
        player.y = canvas.height - 25;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
        timer = 100;
        internalGameClock = 0;
        wave = 1;
        setTimeout(update, 500); // Pause before restarting
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

        // Move player
        if (moveDirection === 'left') player.x -= player.dx;
        if (moveDirection === 'right') player.x += player.dx;

        // Keep player within canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;

        // Draw player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Draw obstacles
        ctx.fillStyle = "red";
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Check for collisions
            if (collisionDetected(player, obs)) {
                gameOver = true;

                // Display a random motivational message
                ctx.fillStyle = "black";
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                // Update high score
                if (points > highScore) {
                    highScore = points;
                    localStorage.setItem('highScore', highScore);
                }

                // Reset the game after 2 seconds
                setTimeout(resetGame, 2000);
                return;
            }
        }

        // Update internal game clock
        internalGameClock++;

        // Update timer every second
        if (internalGameClock % 10 === 0 && timer > 0) {
            timer--;
        }

        // Spawn new obstacles
        if (internalGameClock % 30 === 0) {
            spawnObstacle();
        }

        // Increase difficulty every 3 waves
        if (wave % 3 === 0) {
            var obstacleCount = Math.floor(obstacles.length * 1.1);
            obstacles.length = obstacleCount;
        }

        // Request next animation frame
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the initial state
    update();
});
