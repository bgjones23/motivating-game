document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = { x: canvas.width / 2 - 10, y: canvas.height - 25, size: 20, dx: 5 };
    var obstacles = [];
    var gameOver = false, gameStarted = false, purpleActive = false;
    var touchStartPosition = null, touchMoveDirection = null;

    canvas.addEventListener('touchstart', function (event) {
        if (!gameStarted) {
            gameStarted = true;
            update();
        }
        touchStartPosition = event.touches[0].clientX;
    });

    canvas.addEventListener('touchmove', function (event) {
        if (!touchStartPosition) return;
        touchMoveDirection = event.touches[0].clientX < touchStartPosition ? 'left' : 'right';
    });

    canvas.addEventListener('touchend', function () {
        touchStartPosition = touchMoveDirection = null;
    });

    function spawnObstacle() {
        obstacles.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20, type: 'red' });
    }

    function spawnGoldenObstacle() {
        obstacles.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20, type: 'golden' });
    }

    function spawnPurpleObstacle() {
        obstacles.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20, type: 'purple' });
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + 20 && rect1.x + rect1.size > rect2.x && rect1.y < rect2.y + 20 && rect1.y + rect1.size > rect2.y;
    }

    function resetGame() {
        player.x = canvas.width / 2 - 10;
        player.y = canvas.height - 25;
        obstacles = [];
        gameOver = false;
        gameStarted = false;
        purpleActive = false;
        setTimeout(update, 500);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            return;
        }

        if (touchMoveDirection === 'left') player.x -= player.dx;
        if (touchMoveDirection === 'right') player.x += player.dx;
        player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));

        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        ctx.fillStyle = "red";
        for (var i = 0; i < obstacles.length; i++) {
            var obs = obstacles[i];
            obs.y += obs.type === 'purple' ? 2 : 5;
            ctx.fillStyle = obs.type === 'red' ? 'red' : (obs.type === 'golden' ? 'gold' : 'purple');
            ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

            if (collisionDetected(player, obs)) {
                if (obs.type === 'red') {
                    gameOver = true;
                    ctx.fillStyle = "black";
                    ctx.font = "30px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
                    setTimeout(resetGame, 2000);
                    return;
                } else if (obs.type === 'golden') {
                    obstacles.splice(i, 1);
                    i--;
                } else if (obs.type === 'purple') {
                    purpleActive = true;
                    obstacles.splice(i, 1);
                    i--;
                }
            }
        }

        if (!purpleActive && Math.random() < 0.02) {
            spawnPurpleObstacle();
        } else if (Math.random() < 0.1) {
            spawnObstacle();
        } else if (Math.random() < 0.1) {
            spawnGoldenObstacle();
        }

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Score: ${obstacles.length}`, canvas.width - 10, 20);
        ctx.fillText(`Time: ${purpleActive ? "Active" : "Inactive"}`, canvas.width - 10, 40);

        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    update();
});
