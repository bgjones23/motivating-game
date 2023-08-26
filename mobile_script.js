document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 25,
        size: 20,
        speed: 5,
        dx: 0,
        dy: 0
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

    var moveDirection = null;

    function startGame() {
        gameStarted = true;
        update();
    }

    function handleTouchStart(e) {
        if (!gameStarted) {
            startGame();
        }

        var touch = e.touches[0];
        var touchX = touch.clientX;
        var touchY = touch.clientY;

        // Calculate the direction based on touch position
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        var deltaX = touchX - centerX;
        var deltaY = touchY - centerY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            moveDirection = deltaX > 0 ? 'right' : 'left';
        } else {
            moveDirection = deltaY > 0 ? 'down' : 'up';
        }
    }

    function handleTouchEnd() {
        moveDirection = null;
    }

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            return;
        }

        // Move player based on joystick-like touch input
        if (moveDirection === 'left') player.dx = -player.speed;
        if (moveDirection === 'right') player.dx = player.speed;
        if (moveDirection === 'up') player.dy = -player.speed;
        if (moveDirection === 'down') player.dy = player.speed;

        // Update player's position
        player.x += player.dx;
        player.y += player.dy;

        // Keep player within canvas bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

        // Draw player
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // ... (Add obstacle drawing, collision detection, and game logic here)

        // Request next animation frame
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the initial state
    update();
});
