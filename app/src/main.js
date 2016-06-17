window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_window', { preload: preload, create: create, update: update, render:render});
    var cursors;
    var player;
    var bg, bgnear;
    var asteroidCount;
    var maxAsteroids = 20;

    function preload () {
        game.load.image('player_ship', 'app/sprite/ship.png');
        //game.load.atlas('test', 'app/sprite/atlas_hash_trim.png', 'app/sprite/atlas_json_array_trim.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('asteroids', 'app/sprite/asteroids.png', 'app/sprite/asteroids.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    function create () {
        game.world.setBounds(0, 0, 1920, 1920);
        var stars = game.add.bitmapData(512, 512, null, true);
        for(i = 0; i<30;i++) {
            var x = Math.floor((Math.random() * 512)); 
            var y = Math.floor((Math.random() * 512)); 
            stars.rect(x, y, 8, 8, 'rgba(255,255,255,1)');
        }
        
        bg = game.add.tileSprite(0, 0, game.width, game.height, stars);
        bg.fixedToCamera = true;
        bg.tileScale.set(0.5);
        bg.tint = 0x555555;

        bgnear = game.add.tileSprite(0, 0, game.width, game.height, stars);
        bgnear.fixedToCamera = true;
        bgnear.tint = 0x888888;

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player_ship');
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.bounce = new Phaser.Point(0.5,0.5);
        player.body.collideWorldBounds = true;
        player.body.drag = 1000;
        player.body.angularDrag = 500;

        cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(player);
        ast = game.add.sprite(game.world.centerX, game.world.centerY, 'asteroids', 'reg_lg');
        ast.scale.setTo(2,2);
    }

    function update () {
        if (cursors.left.isDown)
            player.body.angularVelocity = -200;
        else if (cursors.right.isDown)
            player.body.angularVelocity = 200;

        if (cursors.up.isDown) {
            var angle = game.math.degToRad(player.body.rotation - 90);
            player.body.acceleration = new Phaser.Point(100 * Math.cos(angle), 100 * Math.sin(angle));
        }
        else {
            player.body.acceleration.x = 0;
            player.body.acceleration.y = 0;
        }
        
        bg.tilePosition.set(this.game.camera.x * -0.5, this.game.camera.y * -0.5);
        bgnear.tilePosition.set(this.game.camera.x * -1, this.game.camera.y * -1);

    }

    function render() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }
};
