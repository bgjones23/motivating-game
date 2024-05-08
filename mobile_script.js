document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');

    function adjustCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (!gameStarted) {
            displayStartMessage();
        }
    }

    adjustCanvas();

    var gameStarted = false;
    var gameOver = false;

    // Display initial game instructions
    function displayStartMessage() {
        ctx.fillStyle = 'black';
        ctx.font = '20px Futura';
        ctx.textAlign = 'center';
        ctx.fillText('Touch to start', canvas.width / 2, canvas.height / 2);
    }

    // Set up touch events to start the game
    canvas.addEventListener('touchstart', function(event) {
        if (!gameStarted) {
            startGame();
        }
    });

    function startGame() {
        gameStarted = true;
        updateGame();
    }

    function updateGame() {
        if (!gameStarted) {
            return; // Exit if the game hasn't started
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw something simple to test display
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 100, 100); // Draw a test rectangle

        requestAnimationFrame(updateGame); // Continue updating the game
    }

    // Listen for window resize to adjust canvas size
    window.addEventListener('resize', adjustCanvas);
});
