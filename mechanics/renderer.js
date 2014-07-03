var maps = [];

function Mapper(gamestage) {
	this.collisionArray = [[],[]];
	this.container = new createjs.Container();
	this.container.x = 0;
	this.container.y = 0;
	this.gamestage = gamestage;
	this.heightOffset = 0;
	this.mapData = maps[0];
	this.lastWidthOffset = 0;
	this.tileset = new Image();
	this.transitioncount = 0;
	this.transitiondown = false;
	this.transitionup = false;
	this.widthOffset = null;
	this.backgroundContainer1 = new createjs.Container();
	this.backgroundContainer2 = new createjs.Container();
	this.lastbackgroundContainer = new createjs.Container();
	this.backgroundTicks = 1;
	this.basicCollision = null;
	this.completedMapsWidthOffset = 0;
	this.deathCollisionArray = [[],[]];
	this.doneRendering = false;
	this.enemies = [];
	this.enemyContainer = new createjs.Container();
	this.lastContainer = new createjs.Container();
	this.mapcounter = 0;
	this.stitchingoffset = 0;

	// figure out offsets:
	this.heightOffset = this.gamestage.canvas.height - this.mapData.tilesets[0].tileheight * this.mapData.layers[0].height;
	if (mobile) {
		this.heightOffset -= 48;
	}
	// correct for collisions:
	this.heightOffset -= (this.heightOffset + 16) % 16;

	if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
		this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
	} else {
		this.widthOffset = 0;
	}

	// getting imagefile from first tileset
	this.tileset.src = this.mapData.tilesets[0].image;

	this.beginCaching = function(container) {
		container.cache(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.gamestage.canvas.height); //this.mapData.tilesets[0].tileheight * this.mapData.layers[0].height);
	};

	this.advance = function(amount) {
		this.container.x += amount;
		this.backgroundContainer1.x += amount;
		this.backgroundContainer2.x += amount;
		this.enemyContainer.x += amount;
	};
	this.showingReadyLabel = false;
	var readyLabel = new createjs.Text("READY", "bold 10px Arial", "#FFF");
	var readyLabel2 = new createjs.Text("READY", "bold 10px Arial", "#000");
	readyLabel.x = this.gamestage.canvas.width / 2 - 10;
	readyLabel.y = this.gamestage.canvas.height / 2;
	readyLabel2.x = this.gamestage.canvas.width / 2 - 9;
	readyLabel2.y = this.gamestage.canvas.height / 2 + 1;
	this.initMap = function () {
		this.prepareRenderer();
		this.container.addChild(this.initLayers());
		this.completeRenderer();

		this.enemyContainer.visible = false;
		player.animations.visible = false;
		this.doneRendering = true;
		this.showingReadyLabel = true;

		this.gamestage.addChild(readyLabel2);
		readyLabel2.visible = false;
		this.gamestage.addChild(readyLabel);
		readyLabel.visible = false;
		setTimeout(function() {
			readyLabel.visible = true;
			readyLabel2.visible = true;
		}.bind(this), 250);
		setTimeout(function() {
			readyLabel.visible = false;
			readyLabel2.visible = false;
		}.bind(this), 500);
		setTimeout(function() {
			readyLabel.visible = true;
			readyLabel2.visible = true;
		}.bind(this), 750);
		setTimeout(function() {
			readyLabel.visible = false;
			readyLabel2.visible = false;
		}.bind(this), 1000);
		setTimeout(function() {
			readyLabel.visible = true;
			readyLabel2.visible = true;
		}.bind(this), 1250);
		setTimeout(function() {
			this.gamestage.removeChild(readyLabel);
			this.gamestage.removeChild(readyLabel2);
		}.bind(this), 1500);
		setTimeout(function() {
			this.showingReadyLabel = false;
		}.bind(this), 3000);
		setTimeout(function() {
			player.animations.visible = true;
			this.enemyContainer.visible = true;
		}.bind(this), 3100);
	};

	this.prepareRenderer = function() {
		this.collisionArray = [[],[]];
		this.deathCollisionArray = [[],[]];

		this.lastContainer = this.container.clone(true);
		this.lastbackgroundContainer = this.backgroundContainer1.clone(true);
		this.gamestage.addChild(this.lastbackgroundContainer);
		this.gamestage.addChild(this.lastContainer);
		this.container.removeAllChildren();
		this.gamestage.removeChild(this.backgroundContainer1);
		this.gamestage.removeChild(this.backgroundContainer2);
		this.gamestage.removeChild(this.container);
		this.container = new createjs.Container();
		this.gamestage.addChild(this.container);
		var fillColor = new createjs.Shape();
		fillColor.graphics.beginFill(this.mapData.properties.backgroundColor).drawRect(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.getMapHeight() + this.heightOffset + this.mapData.tileheight);
		this.backgroundContainer1.addChild(fillColor);
		fillColor = new createjs.Shape();
		fillColor.graphics.beginFill(this.mapData.properties.backgroundColor).drawRect(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.getMapHeight() + this.heightOffset + this.mapData.tileheight);
		this.backgroundContainer2.addChild(fillColor);

		this.enemyContainer.removeAllChildren();
		this.doneRendering = false;
	};

	this.completeRenderer = function() {
		this.container.tickEnabled = false;
		this.container.snapToPixel = true;

		this.enemyContainer.snapToPixel = true;
		this.backgroundContainer1.tickEnabled = false;
		this.backgroundContainer1.snapToPixel = true;

		this.backgroundContainer2.tickEnabled = false;
		this.backgroundContainer2.snapToPixel = true;

		this.beginCaching(this.backgroundContainer1);
		this.beginCaching(this.backgroundContainer2);
		this.beginCaching(this.container);

		this.gamestage.addChild(this.backgroundContainer1);
		this.gamestage.addChild(this.backgroundContainer2);
		this.gamestage.addChild(this.container);
		this.gamestage.addChild(this.lastContainer);
		this.gamestage.removeChild(player.animations);
		this.gamestage.addChild(player.animations);
		this.gamestage.removeChild(this.enemyContainer);
		this.gamestage.addChild(this.enemyContainer);
		player.healthbar.draw();
		if (logFPS) {
			gamestage.addChild(fpsLabel);
		}
		gamestage.addChild(scoreLabel);


		if (mobile) {
			initTouchControls();
		}
	};

	this.nextMapDown = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		this.lastWidthOffset = this.widthOffset;

		this.mapData = maps[++this.mapcounter];


		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitiondown = true;

		this.enemyContainer.y = this.gameBottom;
		this.container.y = this.gameBottom;
		this.backgroundContainer1.y = this.gameBottom;
		this.backgroundContainer2.y = this.gameBottom;

		// build new map
		this.stitchingoffset = parseInt(this.mapData.properties.stitchx) - (lastOffScreenWidth - this.completedMapsWidthOffset);
		this.completedMapsWidthOffset += parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset + this.widthOffset;
		this.container.addChild(this.initLayers());
		this.container.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer1.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer2.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.enemyContainer.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}
	};

	this.getNextMapDirection = function() {
		return this.mapData.properties.nextMapDirection;
	};

    this.getLastMapDirection = function() {
        return this.mapData.properties.lastMapDirection;
    };

	this.nextMapUp = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		console.log(this.getOffScreenWidth());
		this.lastWidthOffset = this.widthOffset;

		this.mapData = maps[++this.mapcounter];


		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitionup = true;

		this.enemyContainer.y = -this.gameBottom;
		this.container.y = -this.gameBottom;
		this.backgroundContainer1.y = -this.gameBottom;
		this.backgroundContainer2.y = -this.gameBottom;

		// build new map
		this.stitchingoffset = parseInt(this.mapData.properties.stitchx) - (lastOffScreenWidth - this.completedMapsWidthOffset);
		console.log(this.stitchingoffset);
		this.completedMapsWidthOffset += parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset + this.widthOffset;
		this.container.addChild(this.initLayers());
		this.container.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer1.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer2.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);
		this.enemyContainer.x = this.stitchingoffset - (this.widthOffset - this.lastWidthOffset);

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}
	};

	this.nextMapRight = function() {
		this.lastWidthOffset = this.widthOffset;
		this.mapData = maps[++this.mapcounter];

		this.collisionArray = [[],[]];
		this.deathCollisionArray = [[],[]];

		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.completedMapsWidthOffset += this.getMapWidth() + this.lastWidthOffset + this.widthOffset;
		// clear out currently displayed map:


		this.prepareRenderer();

		this.container.x = this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer1.x = this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset);
		this.backgroundContainer2.x = this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset);
		this.enemyContainer.x = this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset);
		this.transitionright = true;

		// build new map
		this.container.addChild(this.initLayers());

		this.completeRenderer();

		this.doneRendering = true;
	};

	// loading layers
	this.initLayers = function() {
		// console.log(this.mapData.tilesets[0].image.split("/")[1].split(".")[0]);
		player.watchedElements = [player.healthbar];
		var w = this.mapData.tilesets[0].tilewidth;
		var h = this.mapData.tilesets[0].tileheight;
		this.enemies = [];
		var imageData = {
			images : [ loader.getResult(this.mapData.tilesets[0].image.split("/")[1].split(".")[0]) ],
			frames : {
				width : w,
				height : h
			}
		};

		var mapContainer = new createjs.Container();

		// create spritesheet
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		// loading each layer at a time
		for (var i = 0; i < this.mapData.layers.length; i++) {
			var layer = this.mapData.layers[i];
			// console.log(layer);
			if (layer.type === 'tilelayer') {
				if (i === 1) { // layer one is ground collision layer
					mapContainer.addChild(this.initLayerWithCollisionArray(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
					this.basicCollision = new BasicCollision(this);
				} else if (i === 3) {
					this.enemies = this.initEnemies(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset);
				} else if (i === 2) {
					mapContainer.addChild(this.initLayerWithDeathCollisionArray(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
				} else if (i === 0) { // bg layer
					this.initBackgroundLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset);
				} else {
					mapContainer.addChild(this.initLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
				}
			}

			if (layer.type === 'objectgroup') {
				for (var j = 0; j < layer.objects.length; j++) {
					if (layer.objects[j].type === "platform") {
						this.enemies.push(new Platform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
														layer.objects[j].properties.yrange, layer.objects[j].properties.yduration,
														layer.objects[j].properties.xrange, layer.objects[j].properties.xduration));
					}

					if (layer.objects[j].type === "disappearingplatform") {
						this.enemies.push(new DisappearingPlatform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
																	parseInt(layer.objects[j].properties.starttimer), parseInt(layer.objects[j].properties.onduration),
																	parseInt(layer.objects[j].properties.offduration)));
					}

					if (layer.objects[j].type === "droppingplatform") {
						this.enemies.push(new DroppingPlatform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
																	parseInt(layer.objects[j].properties.duration)));
					}

					if (layer.objects[j].type === "halfwaypoint") {
						this.enemies.push(new HalfwayPoint(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x));
					}

                    if (layer.objects[j].type === "bosspoint") {
                        this.enemies.push(new BossPoint(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x));
                    }
				}
			}
		}


		mapContainer.tickEnabled = false;
		mapContainer.snapToPixel = true;
		this.beginCaching(mapContainer);
		return mapContainer;
	};

	// layer initialization
	this.initEnemies = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var enemyArray = [];
		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// layer data has single dimension array
				var idx = x + y * layerData.width;

				if (layerData.data[idx] !== 0) {
					if (layerData.data[idx] === 1) {
						enemyArray.push(new ShieldGuy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 2) {
						enemyArray.push(new Flood(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, true));
					} else if (layerData.data[idx] === 3) {
						enemyArray.push(new PrinterGuy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 4) {
						enemyArray.push(new Copter(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 5) {
						enemyArray.push(new FilingCabinet(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 6) {
						enemyArray.push(new Door(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 99) {
						enemyArray.push(new BigHealth(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, this.basicCollision));
					} else if (layerData.data[idx] === 100) {
						enemyArray.push(new WasteMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 101) {
						enemyArray.push(new AccountingMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 50) {
						enemyArray.push(new KillCopy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					}
				}
			}
		}

		return enemyArray;
	};

	// layer initialization
	this.initLayer = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell

				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap.x = widthOffset + x * tilewidth;//300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
					// add bitmap to gamestage
					container.addChild(cellBitmap);
					// internalgamestage.addChild(cellBitmap);
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};


	// layer initialization  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
	this.initBackgroundLayer = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell

				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap1 = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					var spriteLocation = layerData.data[idx] - 1;
					cellBitmap1.gotoAndStop(spriteLocation);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap1.x = widthOffset + x * tilewidth;//300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap1.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;

					if (spriteLocation <= 17) {
						if (spriteLocation % 2 === 1) {
							spriteLocation--;
						} else {
							spriteLocation++;
						}
					}

					var cellBitmap2 = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap2.gotoAndStop(spriteLocation);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap2.x = widthOffset + x * tilewidth;//300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap2.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;

					// add bitmap to gamestage
					this.backgroundContainer1.addChild(cellBitmap1);
					this.backgroundContainer2.addChild(cellBitmap2);
					// internalgamestage.addChild(cellBitmap);
				}
			}
		}
	};

	// layer initialization
	this.initLayerWithCollisionArray = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		this.collisionArray = new Array(layerData.height);
		for (var y = 0; y < layerData.height; y++) {
			this.collisionArray[y] = new Array(layerData.width);
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = null;
					if (y === 0) {
						for (var i = 1; i <= this.getRepeatedTopRows(); i++) {
							cellBitmap = new createjs.Sprite(tilesetSheet);
							// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
							cellBitmap.gotoAndStop(layerData.data[idx] - 1);
							cellBitmap.x = widthOffset + x * tilewidth;
							cellBitmap.y = heightOffset + (y - i) * tileheight;
							container.addChild(cellBitmap);
						}
					}

					cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					cellBitmap.x = widthOffset + x * tilewidth;
					cellBitmap.y = heightOffset + y * tileheight;
					container.addChild(cellBitmap);

					// internalgamestage.addChild(cellBitmap);

					this.collisionArray[y][x] = true;
				} else {
					this.collisionArray[y][x] = false;
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	// layer initialization
	this.initLayerWithDeathCollisionArray = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		this.deathCollisionArray = new Array(layerData.height);
		for ( var y = 0; y < layerData.height; y++) {
			this.deathCollisionArray[y] = new Array(layerData.width);
			for ( var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap.x = widthOffset + x * tilewidth;//300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
					// add bitmap to gamestage
					container.addChild(cellBitmap);
					// internalgamestage.addChild(cellBitmap);

					this.deathCollisionArray[y][x] = true;
				} else {
					this.deathCollisionArray[y][x] = false;
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	this.tickActions = function() {
		this.backgroundTicks--;
		if (this.backgroundTicks === 0) {
			if (this.backgroundContainer2.visible) {
				this.backgroundContainer2.visible = false;
				this.backgroundContainer1.visible = true;
			} else {
				this.backgroundContainer2.visible = true;
				this.backgroundContainer1.visible = false;
			}

			this.backgroundTicks = 16 / lowFramerate;
		}

		var halfIt = 2;

		if (this.transitionright) {
			if (this.transitioncount < (60 / halfIt)) {
				this.transitioncount++;
				this.container.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				this.backgroundContainer1.x -=(this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				this.backgroundContainer2.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				this.enemyContainer.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				this.lastContainer.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				this.lastbackgroundContainer.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				player.animations.x -= (this.gamestage.canvas.width - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
				player.x += player.animations.spriteSheet._frameWidth / (60 / halfIt);

				if (this.container.x < 0) {
					this.container.x = 0;
					this.enemyContainer.x = 0;
				}

				if (player.animations.x < this.widthOffset) {
					player.animations.x = this.widthOffset;
					player.x = this.completedMapsWidthOffset;
					player.lastx = player.x;
				}
			} else {
				this.enemyContainer.x = 0;
				player.animations.x = this.widthOffset;
				player.x = this.completedMapsWidthOffset + this.widthOffset;
				player.lastx = player.x;
				this.transitioncount = 0;
				this.transitionright = false;
				this.lastContainer.removeAllChildren();
				this.lastbackgroundContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastbackgroundContainer);
			}
		}

		if (this.transitiondown) {
			if (this.transitioncount < (60 / halfIt)) {
				this.transitioncount++;
				this.container.y -= this.gameBottom / (60 / halfIt);
				this.backgroundContainer1.y -= this.gameBottom / (60 / halfIt);
				this.backgroundContainer2.y -= this.gameBottom / (60 / halfIt);
				this.enemyContainer.y -= this.gameBottom / (60 / halfIt);
				this.lastContainer.y -= this.gameBottom / (60 / halfIt);
				this.lastbackgroundContainer.y -= this.gameBottom / (60 / halfIt);
				player.animations.y -= this.gameBottom / (60 / halfIt);
				player.y -= this.gameBottom / (60 / halfIt);

				if (this.stitchingoffset !== 0) {
					this.lastContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					this.lastbackgroundContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					this.container.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					this.backgroundContainer1.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					this.backgroundContainer2.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					this.enemyContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					player.animations.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
					//player.animations.x += player.animations.spritesheet._frameWidth /  30;
				}

				if (this.container.y < 0) {
					this.container.y = 0;
					this.backgroundContainer1.y = 0;
					this.backgroundContainer2.y = 0;
					this.enemyContainer.y = 0;
				}

				if (player.animations.y < 0) {
					player.animations.y = 0;
					player.y = 0;
				}
			} else {
				player.lastx = player.x;
				this.stitchingoffset = 0;
				this.container.x = 0;
				this.backgroundContainer1.x = 0;
				this.backgroundContainer2.x = 0;
				this.enemyContainer.x = 0;
				player.animations.y = 0;
				player.y = 0;
				this.transitioncount = 0;
				this.transitiondown = false;
				this.lastContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastContainer);
				this.lastbackgroundContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastbackgroundContainer);
			}
		}

        if (this.transitionup) {
            if (this.transitioncount < (60 / halfIt)) {
                this.transitioncount++;
                this.container.y += this.gameBottom / (60 / halfIt);
                this.backgroundContainer1.y += this.gameBottom / (60 / halfIt);
                this.backgroundContainer2.y += this.gameBottom / (60 / halfIt);
                this.enemyContainer.y += this.gameBottom / (60 / halfIt);
                this.lastContainer.y += this.gameBottom / (60 / halfIt);
                this.lastbackgroundContainer.y += this.gameBottom / (60 / halfIt);
                player.animations.y += this.gameBottom / (60 / halfIt);
                player.y += this.gameBottom / (60 / halfIt);

                if (this.stitchingoffset !== 0) {
                    this.lastContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    this.lastbackgroundContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    this.container.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    this.backgroundContainer1.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    this.backgroundContainer2.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    this.enemyContainer.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    player.animations.x -= (this.stitchingoffset - (this.widthOffset - this.lastWidthOffset)) / (60 / halfIt);
                    //player.animations.x += player.animations.spritesheet._frameWidth /  30;
                }

                if (this.container.y > 0) {
                    this.container.y = 0;
                    this.backgroundContainer1.y = 0;
                    this.backgroundContainer2.y = 0;
                    this.enemyContainer.y = 0;
                }

                if (player.animations.y < 0) {
                        player.animations.y = 0;
                        player.y = 0;
                }
            } else {
                player.lastx = player.x;
                this.stitchingoffset = 0;
                this.container.x = 0;
                this.backgroundContainer1.x = 0;
                this.backgroundContainer2.x = 0;
                this.enemyContainer.x = 0;
                //player.animations.y = 0;
                //player.y = 0;
                player.jumping = true;
                player.ignoreInput = true;
                player.actions.playerJump = true;
                player.jumpspeed = -4.875;
                player.transitionedUp = true;
                player.animations.gotoAndPlay("jump");
                setTimeout(function() {
                	player.ignoreInput = false;
	                player.actions.playerJump = false;
	                player.actions.jumpReleased = true;
	                player.transitionedUp = false;
                }.bind(this), 500);
                this.transitioncount = 0;
                this.transitionup = false;
                this.lastContainer.removeAllChildren();
                this.gamestage.removeChild(this.lastContainer);
                this.lastbackgroundContainer.removeAllChildren();
                this.gamestage.removeChild(this.lastbackgroundContainer);
            }
        }
	};

	this.bighealthCounter = 0;
	this.littlehealthCounter = 0;
	this.itemDrop = function(x, y) {
		if (itemDropCount === 0) {
		} else if (itemDropCount === 1) {
			this.bighealthCounter += 18;
			this.littlehealthCounter += 20;
		} else if (itemDropCount === 2) {
			this.bighealthCounter += 30;
			this.littlehealthCounter += 30;
		} else if (itemDropCount === 3) {
			this.bighealthCounter += 8;
			this.littlehealthCounter += 8;
		} else if (itemDropCount === 4) {
			this.bighealthCounter += 10;
			this.littlehealthCounter += 18;
		} else if (itemDropCount === 5) {
			this.bighealthCounter += 8;
			this.littlehealthCounter += 10;
		}

		if (this.bighealthCounter > 256) {
			this.enemies.push(new BigHealth(this.enemyContainer, x + 10, y, this.basicCollision));
			this.bighealthCounter -= 256;
		} else if (this.littlehealthCounter > 128) {
			this.enemies.push(new LittleHealth(this.enemyContainer, x + 14, y, this.basicCollision));
			this.littlehealthCounter -= 128;
		}
	};

	this.getMapWidth = function() {
		return this.mapData.tilewidth * (this.mapData.width);
	};

	this.getMapHeight = function() {
		return this.mapData.tileheight * (this.mapData.height - 1);
	};

	this.getCurrentHeightOffset = function() {
		return this.heightOffset;
	};

	this.getOffScreenWidth = function() {
		if (player.animations.x - this.gamestage.canvas.width / 2 >= -2 && player.animations.x - this.gamestage.canvas.width / 2 <= 2) {
			return player.x - this.gamestage.canvas.width / 2;
		} else if (player.animations.x - this.gamestage.canvas.width / 2 < -1) {
			return this.completedMapsWidthOffset;
		} else if (player.animations.x - this.gamestage.canvas.width / 2 > 1) {
			return this.completedMapsWidthOffset + this.getMapWidth() - this.gamestage.canvas.width;
		}

		return 0;
	};

	// the next variable is set up to repeat the top set of rows of the map to make it appear taller so map transitions look right on arbitrary sized screens
	this.getRepeatedTopRows = function() {
		return this.heightOffset / this.mapData.tileheight;
	};

	this.gameBottom = this.heightOffset + this.getMapHeight();
}

