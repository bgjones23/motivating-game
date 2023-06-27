document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    var player = { x: 50, y: canvas.height - 30, size: 20, dy: 0 };
    var obstacles = [];
    var gameOver = false;
    var gravity = 1;

    var motivationalMessages = [
        "Motivate", "Keep after it", "You got this", "Don't stop now", "Believe",
        "You can do it", "Move faster next time", "Let's go", "Let's gooo", "Let's goooooo"
    ];

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight") player.x += 10;
        if (event.key === "ArrowLeft") player.x -= 10;
    });

    function spawnObstacle() {
        var size = 20;
        var x = Math.random() * (canvas.width - size);
        var y = 0;
        obstacles.push({ x, y, size, dy: 0 });
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = 50;
        player.y = canvas.height - 30;
        player.dy = 0;
        obstacles = [];
        gameOver = false;
        requestAnimationFrame(update);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = "blue";
        player.y += player.dy;
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Draw obstacles
        ctx.fillStyle = "red";
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += 5;
            obs.y += obs.dy;
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            // Check for collisions
            if (collisionDetected(player, obs)) {
                gameOver = true;
                player.dy = gravity;
                obs.dy = gravity;

                setTimeout(function() {
                    ctx.fillStyle = "black";
                    ctx.font = "40px Arial";
                    ctx.textAlign = "center";
                    var randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                    ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2);
                }, 1000);

                setTimeout(resetGame, 2000);
                return;
            }
        }

        if (Math.random() < 0.05) spawnObstacle();
        if (!gameOver) requestAnimationFrame(update);
    }

    update();
});