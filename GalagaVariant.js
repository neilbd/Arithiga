
window.addEventListener('load', function(){

	var temp_operator;
	var speech;
	var num_operators_used = 0;
	var hit_num_once = false;
	var hit_operator = false;
	var numbers = null;
	var all_operators = null;
	var points = 0;
	var plus;
	var minus;
	var multiply;
	var power;
	var laser_factory;
	var current_num = 0;
	var operator_count = 0;
	var one;
	var two;
	var three;
	var four;
	var five;
	var six;
	var seven;
	var eight;
	var nine;

	var number_pos = -1;
	var operator_pos = -1;

	var answers = [10, 16, 21, 34, 17, 13, 39, 40, 20, 5, 25, 50];
	var answer_index = 0;

	var Q = Quintus()
		.include('Sprites, Scenes, Input, 2D, UI, Anim, Audio')
		.setup({width: 896, height: 720})
		.controls()
		.enableSound();

	Q.gravityY = 0;

	Q.Sprite.extend('Laser', {

		init: function(p){
			this._super(p, {y: 600, vy: -200, asset: 'long_green_laser.jpg'});

			this.add('2d');

			this.on('hit.sprite', function(collision){
				
				if (collision.obj.isA('Operator') || collision.obj.isA('Number')){

					Q.audio.play("explosion.mp3");
					this.destroy();
				}
				
			});

		Q.audio.play('laser_sound.mp3');

		},

		getPosX: function(){
			return this.p.x;
		},

		getPosY: function(){
			return this.p.y;
		}

	});

	function LaserFactory(){

		var laser_list = [];

		this.addLaser = function(x){
			var laser = new Q.Laser({x: x});
			laser_list.push(laser);
			return laser;
		};

		this.getLasers = function(){
			return laser_list;
		};
	}

	Q.Sprite.extend('Ship', {

		init: function(p){
			this._super(p, {x: 440, y: 680, sheet: 'ship', sprite: 'ship'});
			this.number_of_lives = 3;

			Q.input.on('left',this,'onLeft');
			Q.input.on('right',this,'onRight');
			Q.input.on('up', this, 'onUp');
			Q.input.on('fire',this,'makeLaser');

			this.laser_factory = new LaserFactory();

			this.on('hit.sprite', function(collision){

				if (collision.obj.isA('Number') || collision.obj.isA('Operator')){

					Q.audio.play("explosion.mp3");
					speech = new SpeechSynthesisUtterance("You have been hit");
					window.speechSynthesis.speak(speech);

					this.number_of_lives -= 1;
					hit_num_once = false;
					hit_operator = false;
					current_num = 0;

					if(this.number_of_lives === 0){
						Q.stageScene('end', 2);
						this.destroy();
					}
				}

			});
		},

		makeLaser: function(){
			Q.stage().insert(this.laser_factory.addLaser(this.p.x));
		},

		onRight: function() {

				if(!hit_operator && hit_num_once){

					if(operator_pos === all_operators.length - 1){
						operator_pos = 0;
					}else{
						operator_pos++;
					}

					console.log(all_operators[operator_pos].getOperator());

					this.p.x = all_operators[operator_pos].getPosX();
					speech = new SpeechSynthesisUtterance(all_operators[operator_pos].getOperator());
								window.speechSynthesis.speak(speech);

				}else{

					if(number_pos === numbers.length - 1){
						number_pos = 0;
						console.log(number_pos);
					}else{
						console.log(number_pos);
						number_pos++;
						console.log(number_pos);
					}

					this.p.x = numbers[number_pos].getPosX();
					speech = new SpeechSynthesisUtterance(numbers[number_pos].getValue());
									window.speechSynthesis.speak(speech);

				}
			},

		onLeft: function(){

				if(!hit_operator && hit_num_once){

					if(operator_pos <= 0){
						operator_pos = all_operators.length - 1;
					}else{
						operator_pos--;
					}
					
					console.log(operator_pos);
					this.p.x = all_operators[operator_pos].getPosX();
					speech = new SpeechSynthesisUtterance(all_operators[operator_pos].getOperator());
								window.speechSynthesis.speak(speech);
					
				}else{
					
					if(number_pos <= 0){
						number_pos = numbers.length - 1;
					}else{
						number_pos--;
					}

					console.log(number_pos);

					this.p.x = numbers[number_pos].getPosX();
					speech = new SpeechSynthesisUtterance(numbers[number_pos].getValue());
								window.speechSynthesis.speak(speech);
					
				}
			},

		onUp: function() {

			speech = new SpeechSynthesisUtterance("Combine numbers to get " + answers[answer_index]);
				window.speechSynthesis.speak(speech);

			speech = new SpeechSynthesisUtterance("Current result " + current_num);
				window.speechSynthesis.speak(speech);

			Q.stage().pause();

			setTimeout(function(){
				Q.stage().unpause();
				Q.audio.play("tick.mp3");
			}, 4000);

			
		},

		getLives: function(){
			return this.number_of_lives;
		},

		getPosX: function(){
			return this.p.x;
		},

		getPosY: function(){
			return this.p.y;
		}

	});

	function Operation(number1, number2, operator){

		var result = 0;

		switch(operator){
			case 'plus':
				current_num = number1 + number2;  
				break;                     
			case 'minus':
				current_num = number1 - number2;
				break;
			case 'multiply':
				current_num = number1 * number2;
				break;
			case 'power':
				current_num = Math.pow(number1, number2);
				break;
			case 'divide':
				current_num = Math.floor(number1 / number2);
				break;

		}

		console.log(current_num);

		Q.stage().pause();

		speech = new SpeechSynthesisUtterance("Current result: " + current_num);
			window.speechSynthesis.speak(speech);

		if(current_num === answers[answer_index]){

			speech = new SpeechSynthesisUtterance("Got " + answers[answer_index]);
					window.speechSynthesis.speak(speech);

			switch(num_operators_used){
				case 1:
				case 2:
					points+=100;
					break;
				case 3:
				case 4:
				case 5:
					points+=50;
					break;
				default:
					points+=25;
					break;
			}

			speech = new SpeechSynthesisUtterance("Current points: " + points);
					window.speechSynthesis.speak(speech);
			answer_index += 1;

			if(answer_index === answers.length){
				Q.stageScene('win', 3);
				Q.clearStage(0);
			}else{

				speech = new SpeechSynthesisUtterance("Combine numbers to get " + answers[answer_index]);
					window.speechSynthesis.speak(speech);
			}

			
		}

		setTimeout(function(){Q.stage().unpause();
			Q.audio.play("tick.mp3");
		}, 6000);
		
			
	}

	function loadOperators(){

		if(all_operators !== null){
			
			for(var i = 0; i < all_operators.length; i++){
				all_operators[i].destroy();

			}
		}

		if(numbers !== null){
			for(var i = 0; i < numbers.length; i++){
				numbers[i].destroy();
			}

		}

		plus = new Q.Operator({asset: 'plussymbol.png'});
		plus.setOperator('plus');

		minus = new Q.Operator({asset: 'minussymbol.png'});
		minus.setOperator('minus');

		multiply = new Q.Operator({asset: 'multiplysymbol.png'});
		multiply.setOperator('multiply');

		power = new Q.Operator({asset: 'caret.png'});
		power.setOperator('power');

		divide = new Q.Operator({asset: 'dividesymbol.png'});
		divide.setOperator('divide');

		all_operators = new Array(plus,minus,multiply,power,divide);

		for(var i = 0; i < all_operators.length; i++){
			Q.stage().insert(all_operators[i]);

		}

		operator_pos = -1;

	}

	function loadNumbers(){

		if(all_operators !== null){
			
			for(var i = 0; i < all_operators.length; i++){
				all_operators[i].destroy();

			}
		}

		if(numbers !== null){
			for(var i = 0; i < numbers.length; i++){
				numbers[i].destroy();
			}

		}

		one = new Q.Number({asset: 'one.jpg'});
		two = new Q.Number({asset: 'two.jpg'});
		three = new Q.Number({asset: 'three.jpg'});
		four = new Q.Number({asset: 'four.jpg'});
		five = new Q.Number({asset: 'five.jpg'});
		six = new Q.Number({asset: 'six.jpg'});
		seven = new Q.Number({asset: 'seven.jpg'});
		eight = new Q.Number({asset: 'eight.jpg'});
		nine = new Q.Number({asset: 'nine.jpg'});

		numbers = new Array(one, two, three, four, five, six, seven, eight, nine);

		for(var i = 0; i < 9; i++){
			numbers[i].setValue(i+1);
			Q.stage().insert(numbers[i]);
		}

		number_pos = -1;
	}

	Q.Sprite.extend('Number', {

		init: function(p){
			this._super(p, {
				x: Math.random() * 896,
				y: 80,
				vy: 18
			});

			this.number = 0;
			this.add('2d');

			this.on('hit.sprite', function(collision){

				if (collision.obj.isA('Ship')){
					loadNumbers();
				}

				if (collision.obj.isA('Laser')){

					speech = new SpeechSynthesisUtterance("Hit " + this.number);
					window.speechSynthesis.speak(speech);

					if(hit_num_once && hit_operator){
						Operation(current_num, this.number, temp_operator);
						
					}else{
						current_num = this.number;
						hit_num_once = true;
					}

					hit_operator = false;

					loadOperators();

				}

			});

		},

		setValue: function(number){
			this.number = number;
		},

		getValue: function(){
			return this.number;
		},

		setPosX: function(x){
			this.p.x = x;
		},

		getPosX: function(){
			return this.p.x;
		},

		getPosY: function(){
			return this.p.y;
		},

		getWidth: function(){
			return this.p.w + this.p.x;
		}

	});

	Q.Sprite.extend('Operator', {

		init: function(p){
			this._super(p, {
				x: Math.random()*896,
				y: 80,
				vy: 18
			});

			this.add('2d');

			this.operator = null;

			this.on('hit.sprite', function(collision){

				if (collision.obj.isA('Ship')){
					loadNumbers();
				}

				if (collision.obj.isA('Laser') && hit_num_once && !hit_operator){
					temp_operator = this.operator;
					num_operators_used += 1; 
					hit_operator = true;

					speech = new SpeechSynthesisUtterance("Hit " + this.operator);
					window.speechSynthesis.speak(speech);

					loadNumbers();
					
				}

			});

		},

		setOperator: function(operator){
			this.operator = operator;
		},

		getOperator: function(){
			return this.operator;
		},

		getPosX: function(){
			return this.p.x;
		},

		getPosY: function(){
			return this.p.y;
		},

		getWidth: function(){
			return this.p.w + this.p.x;
		}

	});

	Q.scene('main', function(stage){

		Q.clearStage(3);

		stage.insert(new Q.Repeater({asset: 'background.jpg', speedX: 0.5, speedY: 0.5}));

		stage.collisionLayer(new Q.TileLayer({dataAsset: 'background_tiles.json', sheet: 'tiles', tileW: 896, tileH: 720, type: Q.SPRITE_ALL}));

	//	Q.audio.play('tacky_background_music.mp3', {loop:true});

		var player = new Q.Ship();
		stage.insert(player);
	
		loadNumbers();

		answer_index = 0;

		current_num = 0;

		points = 0;

		hit_num_once = false;
		hit_operator = false;
		
		speech = new SpeechSynthesisUtterance("Combine numbers to get " + answers[answer_index]);
					window.speechSynthesis.speak(speech);

		speech = new SpeechSynthesisUtterance("Current result " + current_num);
					window.speechSynthesis.speak(speech);

		Q.stage().pause();

		setTimeout(function(){
			Q.stage().unpause();
			Q.audio.play("tick.mp3");
		}, 4000);

		

	});

	Q.scene('hud', function(stage){

		var container = stage.insert(new Q.UI.Container({
		      y: 50,
		      x: 50 
	    }));

		var current_num_display = container.insert(new Q.UI.Text({x: 10, y: 10, label: "Current: " + current_num, color: "red"}));
		var answer_display = container.insert(new Q.UI.Text({x: 100, y: 10, label: answers[answer_index], color: "red"}));

		container.fit(20);

	});

	Q.scene('win', function(stage){

		for(var i = 0; i < numbers.length; i++){
			numbers[i].destroy();

		}

		if(all_operators !== null){
			
			for(var i = 0; i < all_operators.length; i++){
				all_operators[i].destroy();

			}
		}

		var container = stage.insert(new Q.UI.Container({
		      y: Q.height/2 - 30,
		      x: Q.width/2 - 30
	    }));

		var game_over = container.insert(new Q.UI.Text({x: 10, y: 10, label: "You Win!", color: "red"}));

		Q.input.on('up', this, function(){
			Q.clearStages();
			Q.stageScene('main');
		});

		container.fit(20);
		
		speech = new SpeechSynthesisUtterance("You win!");
					window.speechSynthesis.speak(speech);
		speech = new SpeechSynthesisUtterance("Current Points " + points);
					window.speechSynthesis.speak(speech);
		speech = new SpeechSynthesisUtterance("Press the up arrow to play again");
					window.speechSynthesis.speak(speech);
		
	});

	Q.scene('end', function(stage){

		//Q.audio.stop('tacky_background_music.mp3');

		for(var i = 0; i < numbers.length; i++){
			numbers[i].destroy();

		}

		if(all_operators !== null){
			
			for(var i = 0; i < all_operators.length; i++){
				all_operators[i].destroy();

			}
		}

		var container = stage.insert(new Q.UI.Container({
		      y: Q.height/2 - 30,
		      x: Q.width/2 - 30
	    }));

		var game_over = container.insert(new Q.UI.Text({x: 10, y: 10, label: "Game Over", color: "red"}));

		Q.input.on('up', this, function(){
			Q.clearStages();
			Q.stageScene('main');
		});

		container.fit(20);
		
		speech = new SpeechSynthesisUtterance("Game Over. Press the up arrow to play again");
					window.speechSynthesis.speak(speech);
		speech = new SpeechSynthesisUtterance("Current points " + points);
					window.speechSynthesis.speak(speech);
		speech = new SpeechSynthesisUtterance("Press the up arrow to play again");
					window.speechSynthesis.speak(speech);
		
	});

	Q.load('galaga-ship.jpg, background.jpg, background_tiles.json, long_green_laser.jpg, minussymbol.png, plussymbol.png, caret.png, multiplysymbol.png, dividesymbol.png, one.jpg, two.jpg, three.jpg, four.jpg, five.jpg, six.jpg, seven.jpg, eight.jpg, nine.jpg, laser_sound.mp3, explosion.mp3, tick.mp3', function(){

		Q.sheet('ship', 'galaga-ship.jpg', {tilew: 42, tileh: 48});
		Q.sheet('laser','long_green_laser.jpg', {tilew: 20, tileh: 30});

		Q.stageScene('main');

	});

});



