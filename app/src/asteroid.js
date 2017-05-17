/*
 * asteroid.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Control logic for asteroids.
 * -> Spawning 
 * -> Removing
 * -> Physics
 * -> Breakdown
 */

/*
 * Creates an asteroid at a given x-y coordinate.
 * Creates an asteroid of the given scale.
 * Scale is 0-3. 0 for a non-colliding particle that dies.
 * 1-3 for the different sizes of asteroids.
 */
SpaceMailman.Game.prototype.spawnAsteroid = function(x,y,scale) {
    var astSprite, radius = 0;
    switch(scale) {
        case 0:
            astSprite = 'reg_particle';
            break;
        case 1:
            astSprite = 'reg_small';
            radius = 16;
            break;
        case 2:
            astSprite = 'reg_med';
            radius = 32;
            break;
        default:
            astSprite = 'reg_lg';
            radius = 48;
            scale = 3
    }

    ast = asteroids.create(x, y, 'asteroids', astSprite);
    ast.body.collideWorldBounds = true;
    ast.body.setCircle(radius,-(radius/2),-(radius/2));
    ast.body.drag.set(0.01);
    ast.body.bounce.set(0.5);
    ast.scale.set(2);
    ast.asteroidSize = scale;
    ast.smoothed = false;
    ast.body.velocity.set(600*(Math.random()-0.5),600*(Math.random()-0.5));
}

// Destroys an asteroid. Breaks it down.
SpaceMailman.Game.prototype.destroyAsteroid = function(asteroid) {
    var newX = asteroid.x;
    var newY = asteroid.y;
    var newSize = asteroid.sprite.asteroidSize - 1;

    //Destroy the asteroid.
    this.explodeAt(asteroid.x,asteroid.y);
    asteroid.sprite.destroy();
    asteroid.destroy();

    //If we're not at the smallest size, spawn some smaller ones.
    if(newSize < 1)
        return;

    this.spawnAsteroid(newX+64,newY,newSize);
    this.spawnAsteroid(newX-64,newY,newSize);

    player.score += 1;
    this.updateHUD();
}
