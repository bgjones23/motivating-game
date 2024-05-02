document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 360;
    canvas.height = 640;
    var ctx = canvas.getContext("2d");

    var player = {
        x: canvas.width / 2,
        y: canvas.height - 65,
        size: 20,
        speed: 5,
        dx: 0,
    };

    var points = 0;
    var timer = 100;
    var highScore = parseInt(localStorage.getItem('highScore')) || 0;
    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;
    var timerInterval;
    var messageTimeout;
    var obstacleTimeout;

    var motivationalMessages = [
        "keep after it", "you got this", "don't stop now", "believe", "you can do it", 
        "move faster", "let's go", "almost!", "so close!", "keep going", "nation!", 
        "sweet", "motivate, or else", "time to go", "get it", "snap!", "sampsonite!",
        "c'mon!", "almoooooost!", "in a world...", "if not who but us?", 
        "if not now, then when?", "are you not entertained?!?", "seriously?", "dude.",
        "duuuuuuude.", "DUDE!", "you do nice work.", "noice", "realllly noice", 
        "woah...", "c'mon man!", "are you motivated yet?", "pineapple"
    ];

    function startGame() {
        gameStarted = true;
        timerInterval = setInterval(function() {
            if (timer > 0) {
                timer--;
            } else {
                endGame();
            }
        }, 1000);
        spawnObstacle();
        update();
    }

    function endGame() {
        gameOver = true;
        clearInterval(timerInterval);
        showMessage();
        messageTimeout = setTimeout(resetGame, 3000);
    }

    function spawnObstacle() {
        var rand = Math.random();
        var type = rand < 0.03 ? 'gold' : rand < 0.05 ? 'purple' : 'red';
        var obstacle = {
            x: Math.random() * canvas.width,
            y: 0,
            size: 20,
            dy: 4.5,
            type: type
        };
        obstacles.push(obstacle);
        obstacleTimeout = setTimeout(spawnObstacle, 1000);
    }

    function showMessage() {
        ctx.fillStyle = "black";
        ctx.font = "16px Futura";
        ctx.textAlign = "center";
        ctx.fillText(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)], canvas.width / 2, canvas.height / 2);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameStarted) {
            ctx.fillStyle = "black";
            ctx.font = "20px Futura";
            ctx.textAlign = "center";
            ctx.fillText("Touch to start", canvas.width / 2, canvas.height / 2);
            ctx.fillText("Slide left or right to move", canvas.width / 2, canvas.height / 2 + 30);
        } else if (!gameOver) {
            movePlayer();
            drawPlayer();
            updateObstacles();
            drawObstacles();
            checkCollisions();
            displayGameInfo();
        }
        requestAnimationFrame(update);
    }

    function movePlayer() {
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    }

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    function updateObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += obstacles[i].dy;
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.type === 'red' ? 'red' : obstacle.type === 'purple' ? 'purple' : 'gold';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        });
    }

    function checkCollisions() {
        obstacles.forEach((obstacle, index) => {
            if (player.x < obstacle.x + obstacle.size &&
                player.x + player.size > obstacle.x &&
                player.y < obstacle.y + obstacle.size &&
                player.y + player.size > obstacle.y) {
                if (obstacle.type === 'red') {
                    endGame();
                } else if (obstacle.type === 'purple') {
                    timer += 10;
                } else if (obstacle.type === 'gold') {
                    points++;
                }
                obstacles.splice(index, 1);
            }
        });
    }

    function displayGameInfo() {
        ctx.fillStyle = "black";
        ctx.font = "12px Futura";
        ctx.textAlign = "left";
        ctx.fillText("Points: " + points, 10, 20);
        ctx.fillText("Timer: " + timer, 10, 40);
        ctx.fillText("High Score: " + highScore, 10, 60);
    }

    function resetGame() {
        points = 0;
        timer = 100;
        obstacles = [];
        gameStarted = false;
        gameOver = false;
        clearInterval(timerInterval);
        clearTimeout(obstacleTimeout);
    }

    update();
});
