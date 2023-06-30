document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 480;
    canvas.height = 320;
    var ctx = canvas.getContext("2d");

    var player = {
        x: 50,
        y: canvas.height - 25,
        size: 20,
        dx: 0
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

    var keys = {};

    document.addEventListener("keydown", function(event) {
        keys[event.key] = true;
        if (!gameStarted) {
            gameStarted = true;
            update();
        }
    });

    document.addEventListener("keyup", function(event) {
        keys[event.key] = false;
    });

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
        player.dx = 0;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Press any key to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Use arrow keys to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        // Move player
        if (keys["ArrowLeft"]) player.dx = -5;
        else if (keys["ArrowRight"]) player.dx = 5;
        else player.dx = 0;

        player.x += player.dx;

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
                ctx.font = "40px Arial";
                ctx.textAlign = "center";
                var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);

                // Reset the game after 2 seconds
                setTimeout(resetGame, 2000);
                return;
            }
        }

        // Spawn new obstacles
        if (Math.random() < 0.05) spawnObstacle();

        // Request next animation frame
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the game loop
    update();
});
