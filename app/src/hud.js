/*
 * hud.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Stuff for the heads up display.
 */

//Creates the objects necessary for the HUD
SpaceMailman.Game.prototype.createHUD = function() {
    scoreText = game.add.bitmapText(10, 10, 'carrier_command','Score: ',18);
    scoreText.fixedToCamera = true;
    this.updateHUD();
}

//Updates information displayed on the HUD
SpaceMailman.Game.prototype.updateHUD = function() {
    scoreText.text = "score: " + player.score;
}

