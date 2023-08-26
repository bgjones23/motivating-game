function startGame() {
    gameStarted = true;
    gameOver = false;
    timerInterval = setInterval(function() {
        timer--;
        if(timer <= 0) {
            gameOver = true;
            clearInterval(timerInterval);
        }
    }, 1000);
}

function spawnObstacle() {
    var colorOptions = ['red', 'gold', 'purple'];
    var color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    var obstacle = {
        x: Math.random() * (canvas.width - 20),
        y: -20,
        size: 20,
        color: color,
        speed: Math.random() * 2 + 3 + points * 0.05
    };
    obstacles.push(obstacle);
}

function collisionDetected(rect1, rect2) {
    return rect1.x < rect2.x + rect2.size &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.size &&
           rect1.y + rect1.size > rect2.y;
}

function updateHighScore() {
    if(points > highScore) {
        highScore = points;
        localStorage.setItem('highScore', highScore);
    }
}

function resetGame() {
    points = 0;
    timer = 100;
    obstacles = [];
    gameOver = false;
    gameStarted = false;
    clearInterval(timerInterval);
}

function update() {
    if(!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e66465');
        gradient.addColorStop(1, '#9198e5');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Player Movement with Boundaries
        player.x += player.dx;
        if(player.x < 0) {
            player.x = 0;
        }
        if(player.x + player.size > canvas.width) {
            player.x = canvas.width - player.size;
        }
        
        ctx.fillStyle = "#4CAF50";  // Player color
        ctx.fillRect(player.x, player.y, player.size, player.size);

        // Obstacle Movement and Collision
        for(let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            obstacle.y += obstacle.speed;

            // Draw Obstacle with rounded edges
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            ctx.rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
            ctx.fill();
            
            // Check for collisions
            if(collisionDetected(player, obstacle)) {
                if(obstacle.color === 'red') {
                    gameOver = true;
                    clearInterval(timerInterval);
                } else if(obstacle.color === 'gold') {
                    points++;
                    obstacles.splice(i, 1);
                    i--;
                } else if(obstacle.color === 'purple') {
                    timer += 5;
                    obstacles.splice(i, 1);
                    i--;
                }
            }

            // Remove obstacle if out of screen
            if(obstacle.y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }

        // Handle obstacle spawning
        if(Math.random() < 0.02 + points * 0.001) { // Increase spawn rate with points
            spawnObstacle();
        }

        // Display Scores and Timer
        ctx.fillStyle = "white";
        ctx.font = "18px Futura";
        ctx.textAlign = "right";
        ctx.fillText(`Points: ${points}`, canvas.width - 10, 25);
        ctx.fillText(`Time: ${timer}s`, canvas.width - 10, 50);
        ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 75);

        displayCopyright();

        requestAnimationFrame(update);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "24px Futura";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        updateHighScore();
    }
}

// Start the game loop
update();
