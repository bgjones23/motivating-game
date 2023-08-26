document.addEventListener('DOMContentLoaded', function() {
    // ... [rest of the variables unchanged]

    function startGame() {
        if (!gameStarted) { // Only start the game if it hasn't started yet
            gameStarted = true;
            // ... [rest of the startGame function unchanged]
            update();
        }
    }

    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        if (!gameStarted) {
            startGame();
        } else {
            switch (event.key) {
                case 'ArrowLeft':
                    player.dx = -1;
                    break;
                case 'ArrowRight':
                    player.dx = 1;
                    break;
                case 'ArrowUp':
                    player.dy = -1;
                    break;
                case 'ArrowDown':
                    player.dy = 1;
                    break;
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (!gameOver && gameStarted) {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    player.dx = 0;
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    player.dy = 0;
                    break;
            }
        }
    });

    // ... [rest of the functions unchanged]

    function update() {
        // ... [rest of the update function unchanged]

        // This condition was moved from the startGame function to prevent the update function from being called multiple times.
        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    // Start the game loop
    update();
});
