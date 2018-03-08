import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {
	preload(){
		this.game.load.image('mountains-back', 'assets/img/back/mountains-back.png')
		this.game.load.image('mountains-mid1', 'assets/img/back/mountains-mid1.png')
		this.game.load.image('mountains-mid2', 'assets/img/back/mountains-mid2.png')

		this.game.load.image('floor_tile', './assets/img/dirt_snow.png')
		this.game.load.image('restart', './assets/img/reset.png');
		this.game.load.image('ground', './assets/img/platform.png');
		this.game.load.image('tile', './assets/img/brick_grey.png')
		this.game.load.image('dude','./assets/img/blue.png');
		this.game.load.image('moon', './assets/img/moon.png')

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
		this.game.physics.arcade.collide(this.floor, this.player);
		this.game.physics.arcade.collide(this.floor, this.blocks);

		var cursors = this.input.keyboard.createCursorKeys();

		if (cursors.left.isDown) {
			this.player.body.velocity.x=-260;
		}
		else if (cursors.right.isDown) {
			this.player.body.velocity.x = 260;
		}
		else {
			this.player.body.velocity.x=0;
		}

		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y=-600;
		}
		this.game.physics.arcade.collide(this.player, this.blocks, this.gameOver, null, this);

		this.mountainsBack.tilePosition.x -=.05
		this.mountainsMid1.tilePosition.x -=.3
		this.mountainsMid2.tilePosition.x -= .75

	}
	createPlayer (){
		this.player = this.game.add.sprite(100, 450, 'dude')
		this.player.scale.setTo(.5, .5)
		this.game.physics.arcade.enable(this.player);
		this.player.bounce = .2
		this.player.body.gravity.y = 800;
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
		this.mountainsBack = this.game.add.tileSprite(0, 
		this.game.height - this.game.cache.getImage('mountains-back').height,
		this.game.width,
		this.game.cache.getImage('mountains-back').height, 'mountains-back')

		this.mountainsMid1 = this.game.add.tileSprite(0,
			this.game.height - this.game.cache.getImage('mountains-mid1').height,
			this.game.width,
			this.game.cache.getImage('mountains-mid1').height, 'mountains-mid1')

		this.mountainsMid2 = this.game.add.tileSprite(0,
			this.game.height - this.game.cache.getImage('mountains-mid2').height,
			this.game.width,
			this.game.cache.getImage('mountains-mid2').height, 'mountains-mid2')

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
