/*
 * boot.js
 * Copyright (C) 2016 konrad <konrad@serenity>
 *
 * Distributed under terms of the MIT license.
 *
 * Contains initial setup logic of the game.
 */

// Define game object here
var SpaceMailman = {}

SpaceMailman.Boot = function (game) {

};

SpaceMailman.Boot.prototype = {
    init: function () {
        // Multitouch not supported.
        this.input.maxPointers = 1;

        // Pause if we lose focus.
        this.stage.disableVisibilityChange = false;

        // Desktop Configuration
        if (this.game.device.desktop)
        {
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            // Mobile Configuration
            // Scale the game down for mobile devices
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {
        // Load some assets for the preloader. (Game loading screen)
        //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        //this.load.image('preloaderBar', 'images/preloadr_bar.png');
    },

    create: function () {
        // Switch into the preloader state.
        this.state.start('Preloader');
    }
};
