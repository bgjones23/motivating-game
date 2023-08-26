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

    var touchStartPosition = null;
    var touchMoveDirection = null;

    document.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            update();
        }

        touchStartPosition = e.touches[0].clientX;
    });

    document.addEventListener('touchmove', function(e) {
        if (!touchStartPosition) return;
        var touchX = e.touches[0].clientX;

        if (touchX < touchStartPosition) {
            touchMoveDirection = 'left';
        } else if (touchX > touchStartPosition) {
            touchMoveDirection = 'right';
        }
    });

    document.addEventListener('touchend', function() {
        touchStartPosition = null;
        touchMoveDirection = null;
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

        // Check if the obstacle would spawn outside of the canvas
        if (x < 0 || x + size > canvas.width) {
            return;
        }

        obstacles.push({x, y, size});
    }

    function collisionDetected(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y &&
            !(rect1.x < rect2.x && rect1.x + rect1.size > rect2.x + rect2.size) &&
            !(rect1.y < rect2.y && rect1.y + rect1.size > rect2.y + rect2.size);
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
        points = 0;
        setTimeout(update, 500); // Pause before restarting
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Swipe left or right on the blue square to move", canvas.width / 2, canvas.height / 2 + 30);
            return;
        }

        // Move player
        if (touchMoveDirection === 'left') player.x -= player.
