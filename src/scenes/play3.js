var player;
var diamonds;
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;

export class Play3 extends Phaser.Scene {
    constructor() {
        super("Play3");
    }

    preload(){
        this.load.tilemapTiledJSON("mapLevel3", "public/assets/tilemaps/atlas2.json");
        this.load.image("plataforma", "public/assets/images/platform_atlas.png");
      //  this.load.image("Fondo", "public/assets/images/sky.png");  
    }
    
    create(){
        const map = this.make.tilemap({ key: "mapLevel3" });
       // const tilesetBelow  = map.addTilesetImage("sky", "Fondo");
        const tilesetPlatform  = map.addTilesetImage("platform_atlas", "plataforma");
    
        //const fondoLayer = map.createLayer("fondos", tilesetBelow, 0, 0);
        const platformLayer3 = map.createLayer("plataformas", tilesetPlatform, 0, 0);
        const objects3 = map.getObjectLayer("objetos");
    
        platformLayer3.setCollisionByProperty({ collides: true });

      // tiles marked as colliding
    
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // platformLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    
    

    const spawnPoint3 = map.findObject("objetos", (obj) => obj.name === "dude")

    player = this.physics.add.sprite(spawnPoint3.x, spawnPoint3.y, "dude");
    
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    //  Input Events
    if ((cursors = !undefined)) {
        cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Create empty group of crystal
    
    diamonds = this.physics.add.group();

    // find object layer
    // if type is "crystal", add to stars group
    objects3.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name, type } = objData;
      switch (name) {
        case "diamond": {
          // add star to scene
          // console.lgo("crystal agregada: ", x, y);
          var diamond = diamonds.create(x, y, "diamond");
          diamond.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

    // Create empty group of bombs
    bombs = this.physics.add.group();
    objects3.objects.forEach((objData) => {
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "bombs": {
          var bomb = bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
          bomb.allowGravity = false;
        }
      }
    });

    //  The score
    scoreText = this.add.text(30, 6, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    

    // Collide the player and the crystal with the platforms
    // REPLACE Add collision with worldLayer
    this.physics.add.collider(player, platformLayer3);
    this.physics.add.collider(diamonds, platformLayer3);
    this.physics.add.collider(bombs, platformLayer3);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, diamonds, this.collectDiamond, null, this);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    gameOver = false;
    score = 0;
}

update(){
    if (diamonds.countActive(true) === 0) { 
        this.scene.start("MainMenu", { score: score });    
      }

    if (gameOver) {
      return;
    }
  
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
  
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
  
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
  
      player.anims.play("turn");
    }
  
      // REPLACE player.body.touching.down
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-330);
    }
}
    
    
    collectDiamond(player, diamond) {
        diamond.disableBody(true, true);
    
        //  Add and update the score
        score += 10;
        scoreText.setText("Score: " + score);
    
    }
    
    hitBomb(player, bomb) {
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play("turn");
    
        gameOver = true;
    
        // Función timeout usada para llamar la instrucción que tiene adentro despues de X milisegundos
        setTimeout(() => {
        // Instrucción que sera llamada despues del segundo
        this.scene.start(
            "Retry",
            { score: score } // se pasa el puntaje como dato a la escena RETRY
        );
        }, 1000); // Ese número es la cantidad de milisegundos
    }

  

}





