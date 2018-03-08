import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {
	preload(){
		this.game.load.image('mountains-back', 'assets/img/back/mountains-back.png')
		this.game.load.image('mountains-mid1', 'assets/img/back/mountains-mid1.png')
        this.game.load.image('mountains-mid2', 'assets/img/back/mountains-mid2.png')
        
        this.game.load.image('one', 'assets/img/back/1.png')
		this.game.load.image('two', 'assets/img/back/2.png')
        this.game.load.image('three', 'assets/img/back/3.png')
        this.game.load.image('four', 'assets/img/back/4.png')
		this.game.load.image('five', 'assets/img/back/5.png')

		this.game.load.image('floor_tile', './assets/img/dirt_snow.png')
		this.game.load.image('restart', './assets/img/reset.png');
		this.game.load.image('tile', './assets/img/brick_grey.png')
		this.game.load.image('dude','./assets/img/blue.png');
        this.game.load.image('moon', './assets/img/moon.png')
        this.game.load.spritesheet('mort', './assets/img/mort.png', 24, 22)

		this.game.load.audio('main', './assets/sound/music.mp3');
		this.game.load.audio('death', './assets/sound/death.mp3');
	}
	create() {
		this.blockSpeed = -650
		this.loadBackground();

		this.music = this.game.add.audio('main')
		this.music.play()
		this.music.volume = .1
		this.music.loop = true
	
		this.score = 0
		this.tileWidth = this.game.cache.getImage('tile').width;
		this.tileHeight = this.game.cache.getImage('tile').height

		this.game.stage.backgroundColor = '697e96'
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.createPlayer();

		this.blocks = this.game.add.group()

		this.loadFloor()
		this.createScore()
		this.colSpeed = 3500
		this.timer = this.game.time.events.loop(this.colSpeed, this.addCol, this)
		
	}
	update(){
		var cursors = this.input.keyboard.createCursorKeys();
		this.game.physics.arcade.collide(this.floor, this.player);
		this.game.physics.arcade.collide(this.floor, this.blocks);
		
		if (cursors.left.isDown) {
			this.player.body.velocity.x=-260;
		}
		else if (cursors.right.isDown) {
			this.player.animations.play('right');
			this.player.body.velocity.x = 260;
		}
		else {
			this.player.body.velocity.x=0;
            this.player.frame = 1;
		}
		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y=-1200;
		}

		this.game.physics.arcade.collide(this.player, this.blocks, this.gameOver, null, this);

        // this.one.tilePosition.x -=.05
		this.two.tilePosition.x -=.2
        this.three.tilePosition.x -= .4
        this.four.tilePosition.x -= .6
        this.five.tilePosition.x-= .75

	}
	createPlayer (){
        this.player = this.game.add.sprite(15, 450, 'mort');
        this.player.frame = 1;
        this.player.animations.add('right', [8,9,10,11,12], 10, true);
		this.player.scale.setTo(4, 4)
		this.game.physics.arcade.enable(this.player);
		this.player.body.width = 72
		this.player.body.height = 84
		this.player.body.gravity.y = 3000;
		this.player.body.collideWorldBounds = true;
	}
	addTile(x, y){
		var block = this.game.add.sprite(x, y, 'tile')
		block.scale.setTo(.5)
		this.blocks.add(block)

		this.game.physics.arcade.enable(block)
		block.body.velocity.x = this.blockSpeed

		block.checkWorldBounds = true
		block.outOfBoundsKill = true
		this.game.physics.arcade.overlap(this.player, block, this.gameOver, null, this);

	}
	addCol(){
		this.incrementScore()
		this.blockSpeed -=25
		var tilesToMake = Math.floor(Math.random() * 3)+1
		for (var i=tilesToMake; i>=0; i--){
			this.addTile(this.game.world.width, 680 - i*(this.tileHeight*.5))
		}
	}
	createScore(){
		var scoreFont = "32px Arial";
		this.scoreLabel = this.game.add.text(16, 16, "Score: 0", { font: scoreFont, fill: "#fff" });

		this.scoreLabel.align = 'left';
	}
	incrementScore(){
		this.score++;
		this.scoreLabel.text = "Score: " + this.score;
	}
	gameOver() {
		this.music.stop()
		this.blocks.destroy();
        this.scoreLabel.destroy()
        this.player.frame = 1;

		var style = { font: "bold 100px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		var text = this.game.add.text(0, 0, "Game Over", style);
		text.setTextBounds(0, 150, 800, 100);

		var subStyle = { font: "bold 75px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		var subText = this.game.add.text(0, 0, "Score: " + this.score, style);
		subText.setTextBounds(0, 300, 800, 100);

		var death = this.game.add.audio('death')
		death.play()
		death.volume = .1
		this.game.add.button(this.game.world.centerX, 400, 'restart', ()=> this.restart(), this, 2, 1, 0)
	}
	loadBackground(){
        // this.one = this.game.add.tileSprite(0, 
        //     this.game.height - this.game.cache.getImage('one').height,
        //     this.game.width,
        //     this.game.cache.getImage('one').height, 'one')
    
            this.two = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('two').height,
                this.game.width,
                this.game.cache.getImage('two').height, 'two')
    
            this.three = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage('three').height,
                this.game.width,
                this.game.cache.getImage('three').height, 'three')

                this.four = this.game.add.tileSprite(0,
                    this.game.height - this.game.cache.getImage('four').height,
                    this.game.width,
                    this.game.cache.getImage('four').height, 'four')
        
                this.five = this.game.add.tileSprite(0,
                    this.game.height - this.game.cache.getImage('five').height,
                    this.game.width,
                    this.game.cache.getImage('five').height, 'five')

		this.game.add.image(65, 65, 'moon')
	}
	loadFloor(){
		this.floor = this.game.add.sprite(0, this.game.height-120, 'floor_tile')
		this.game.physics.arcade.enable(this.floor);
		this.floor.enableBody = true;
		this.floor.body.immovable = true;
		this.floor.width = this.game.width
	}
	restart(){
		this.score = 0
		this.player.kill()
		this.game.state.restart()
	}

}

export default GameState;
