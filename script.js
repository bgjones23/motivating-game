document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 360;
    canvas.height = 640;
    var ctx = canvas.getContext("2d");

    var player = {
        x: 160,
        y: canvas.height - 45,
        size: 40
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    var startMessage = isMobile ? "Tap to start" : "Press any key to start";
    var moveInstruction = isMobile ? "Tap left or right of the blue square to move" : "Use arrow keys to move";

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

    function displayStartScreen() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(startMessage, canvas.width / 2, canvas.height / 2);
        ctx.fillText(moveInstruction, canvas.width / 2, canvas.height / 2 + 40);
    }

    document.addEventListener("keydown", function () {
        gameStarted = true;
    });

    canvas.addEventListener('touchstart', function (e) {
        if (!gameStarted) {
            gameStarted = true;
            return;
        }
        var touch = e.touches[0];
        if (touch.clientX < player.x && player.x > 0) {
            player.x -= 10;
        } else if (touch.clientX > player.x && player.x < canvas.width - player.size) {
            player.x += 10;
        }
    }, false);

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({ x, y, size });
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = 160;
        player.y = canvas.height - 45;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            displayStartScreen();
            requestAnimationFrame(update);
            return;
        }

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

    update();
});
