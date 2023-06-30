document.addEventListener('DOMContentLoaded', function() {
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

    function displayStartScreen() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Tap to start", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Tap left or right of blue square to move", canvas.width / 2, canvas.height / 2 + 40);
    }

    canvas.addEventListener('touchstart', function(e) {
        if (!gameStarted) {
            gameStarted = true;
            return;
        }
        if(gameOver) {
            return;
        }
        var touch = e.touches[0];
        if (touch.clientX < player.x && player.x > 0) {
            player.x -= 10;
        } else if (touch.clientX > player.x && player.x < canvas.width - player.size) {
            player.x += 10;
        }
    }, false);

    // Remaining part of the script remains same as previously shared in the updated version.

    // ...
});
