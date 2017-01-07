/*
 * hud.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Stuff for the heads up display.
 */
var scoreText;
var shipIcon;
var livesText;

//Creates the objects necessary for the HUD
SpaceMailman.Game.prototype.createHUD = function() {
    scoreText = game.add.bitmapText(10, 10, 'carrier_command','Score: ',18);
    scoreText.fixedToCamera = true;

    shipIcon = this.game.add.sprite(10, 35, 'player_ship');
    shipIcon.fixedToCamera = true;

    livesText = game.add.bitmapText(45, 40, 'carrier_command','x', 18);
    livesText.fixedToCamera = true;
    
    this.updateHUD();
}

//Displays a game over screen.
SpaceMailman.Game.prototype.gameOverScreen = function() {
    var gameovertxt = game.add.bitmapText(this.camera.width/2, this.camera.height/2, 'carrier_command','GAME OVER', 24);
    gameovertxt.fixedToCamera = true;
    gameovertxt.anchor.set(0.5);
}

//Updates information displayed on the HUD
SpaceMailman.Game.prototype.updateHUD = function() {
    scoreText.text = "score: " + player.score;
    livesText.text = "x " + player.lives;
}

