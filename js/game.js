(function() {
  var width = window.innerWidth;
  var height = window.innerHeight > 480 ? 480 : window.innerHeight;
  var gameScore = 0;
  var highScore = 0;
  var lariGame = {
    init: function() {
      this.game = new Phaser.Game(width, height, Phaser.CANVAS, '');
      this.game.state.add("load", this.load);
      this.game.state.add("play", this.play);
      this.game.state.add("title", this.title);
      this.game.state.add("gameOver", this.gameOver);
      this.game.state.add("instructions", this.instructions);
      this.game.state.start("load");
    },
    load: {
      preload: function() {
        this.game.load.audio('Bayu', 'assets/Bayu.mp3');
        this.game.load.audio('ho-ho-ho', 'assets/jatuh.mp3');
        this.game.load.audio('hop', 'assets/loncat.mp3');
        this.game.load.image('platform', 'assets/jalan.png');
        this.game.load.spritesheet('bayuu', 'assets/lari5.png', 37, 52);
        this.game.load.image('gambar-bg', 'assets/gambar-bg.png');
        this.game.load.image("logo", "assets/game-logo.png");
        this.game.load.image("instructions", "assets/cara-main.png");
        this.game.load.image("game-over", "assets/selesai.png");
        this.game.load.image("mulai", "assets/mulai.png");
        this.game.load.image("btn-mulai", "assets/btn-mulai.png");
        this.game.load.image("ulang", "assets/ulang.png");
      },
      create: function() {
        this.game.state.start("title");
      }
    },
  
    title: {
      create: function() {
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'gambar-bg');
        this.logo = this.game.add.sprite(this.game.world.width / 2 - 158, 20, 'logo');
        this.logo.alpha = 0;
        this.game.add.tween(this.logo).to({
          alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0);
        this.startBtn = this.game.add.button(this.game.world.width / 2 - 159, this.game.world.height - 120, 'mulai', this.startClicked);
        this.startBtn.alpha = 0;
        this.game.add.tween(this.startBtn).to({
          alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 1000);
      },
      startClicked: function() {
        this.game.state.start("instructions");
      },
    },
    
    instructions: {
      create: function() {
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'gambar-bg');
        this.instructions = this.game.add.sprite(this.game.world.width / 2 - 292, 30, 'instructions');
        this.instructions.alpha = 0;
        this.game.add.tween(this.instructions).to({
          alpha: 1
        }, 800, Phaser.Easing.Linear.None, true, 0);
        this.playBtn = this.game.add.button(this.game.world.width / 2 - 159, this.game.world.height - 120, 'btn-mulai', this.playClicked);
        this.playBtn.alpha = 0;
        this.game.add.tween(this.playBtn).to({
          alpha: 1
        }, 800, Phaser.Easing.Linear.None, true, 800);
      },
      playClicked: function() {
        this.game.state.start("play");
      },
    },
    
    play: {
      create: function() {
        highScore = gameScore > highScore ? Math.floor(gameScore) : highScore;
        gameScore = 0;
        this.currentFrame = 0;
        this.particleInterval = 2 * 60;
        this.gameSpeed = 580;
        this.isGameOver = false;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.music = this.game.add.audio("Bayu");
        this.music.loop = true;
        this.music.play();
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'gambar-bg');
        this.bg.fixedToCamera = true;
        this.bg.autoScroll(-this.gameSpeed / 6, 0);
        this.emitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        this.platforms.createMultiple(5, 'platform', 0, false);
        this.platforms.setAll('anchor.x', 0.5);
        this.platforms.setAll('anchor.y', 0.5);
        var plat;
        for (var i = 0; i < 5; i++) {
          plat = this.platforms.getFirstExists(false);
          plat.reset(i * 192, this.game.world.height - 24);
          plat.width = 192;
          plat.height = 24;
          this.game.physics.arcade.enable(plat);
          plat.body.immovable = true;
          plat.body.bounce.set(0);
        }
        this.lastPlatform = plat;
        this.lari = this.game.add.sprite(100, this.game.world.height - 200, 'bayuu');
        this.lari.animations.add("run");
        this.lari.animations.play('run', 20, true);
        this.game.physics.arcade.enable(this.lari);
        this.lari.body.gravity.y = 1500;
        this.lari.body.collideWorldBounds = true;
        this.emitter.makeParticles('snowflake');
        this.emitter.maxParticleScale = .02;
        this.emitter.minParticleScale = .001;
        this.emitter.setYSpeed(100, 200);
        this.emitter.gravity = 0;
        this.emitter.width = this.game.world.width * 1.5;
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 40;
        this.game.camera.follow(this.lari);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.emitter.start(false, 0, 0);
        this.score = this.game.add.text(20, 20, '', {
          font: "25px Times New Reoman",
          fill: "Black",
          fontWeight: "bold"
        });
        if (highScore > 0) {
          this.highScore = this.game.add.text(20, 45, 'Best: ' + highScore, {
            font: "25px Times New Reoman",
            fill: "Black"
          });
        }
      },
      update: function() {
        var that = this;
        if (!this.isGameOver) {
          gameScore += .5;
          this.gameSpeed += .03;
          this.score.text = 'Score: ' + Math.floor(gameScore);
          this.currentFrame++;
          var moveAmount = this.gameSpeed / 100;
          this.game.physics.arcade.collide(this.lari, this.platforms);
          if (this.lari.body.bottom >= this.game.world.bounds.bottom) {
            this.isGameOver = true;
            this.endGame();
          }
          if (this.cursors.up.isDown && this.lari.body.touching.down || this.spacebar.isDown && this.lari.body.touching.down || this.game.input.mousePointer.isDown && this.lari.body.touching.down || this.game.input.pointer1.isDown && this.lari.body.touching.down) {
            this.jumpSound = this.game.add.audio("hop");
            this.jumpSound.play();
            this.lari.body.velocity.y = -500;
          }
          if (this.particleInterval === this.currentFrame) {
            this.emitter.makeParticles('snowflake');
            this.currentFrame = 0;
          }
          this.platforms.children.forEach(function(platform) {
            platform.body.position.x -= moveAmount;
            if (platform.body.right <= 0) {
              platform.kill();
              var plat = that.platforms.getFirstExists(false);
              plat.reset(that.lastPlatform.body.right + 192, that.game.world.height - (Math.floor(Math.random() * 50)) - 24);
              plat.body.immovable = true;
              that.lastPlatform = plat;
            }
          });
        }
      },
      endGame: function() {
        this.music.stop();
        this.music = this.game.add.audio("ho-ho-ho");
        this.music.play();
        this.game.state.start("gameOver");
      }
    },
    gameOver: {
      create: function() {
        this.bg = this.game.add.tileSprite(0, 0, width, height, 'gambar-bg');
        this.msg = this.game.add.sprite(this.game.world.width / 2 - 280.5, 50, 'game-over');
        this.msg.alpha = 0;
        this.game.add.tween(this.msg).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 0);
        this.score = this.game.add.text(this.game.world.width / 2 - 100, 200, 'Score: ' + Math.floor(gameScore), {
          font: "50px Times New Reoman",
          fill: "Black"
        });
        this.score.alpha = 0;
        this.game.add.tween(this.score).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 600);
        this.restartBtn = this.game.add.button(this.game.world.width / 2 - 183.5, 280, 'ulang', this.restartClicked);
        this.restartBtn.alpha = 0;
        this.game.add.tween(this.restartBtn).to({
          alpha: 1
        }, 600, Phaser.Easing.Linear.None, true, 1000);
      },
      restartClicked: function() {
        this.game.state.start("play");
      },
    }
  };
  lariGame.init();
})();