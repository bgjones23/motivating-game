document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 480;
    canvas.height = 320;
    var ctx = canvas.getContext("2d");

    var player = {
        x: 50,
        y: canvas.height - 25,
        size: 20,
        dy: 2
    };

    var obstacles = [];
    var gameOver = false;
    var gameStarted = false;

    function displayStartScreen() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press any key to start", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Use arrow keys to move", canvas.width / 2, canvas.height / 2 + 40);
    }

    document.addEventListener("keydown", function() {
        gameStarted = true;
    });

    // Remaining part of the script remains same as previously shared in the updated version.

    // ...
});
