var Particle = Class.extend({
	
	emitter: null,
	sprite: null,
	life_time: 0,
	speed: 0,
	angle: 0,
	age: 0,
	
	init: function(emitter, sprite, life_time, speed, angle)
	{
		this.emitter = emitter;
		this.sprite = sprite;
		this.life_time = life_time;
		this.speed = speed;
		this.angle = angle;
		
		this.age = 0;
	},
	
	update: function (delta)
	{
		this.age += 1;
		
		if (this.age >= this.life_time)
		{
			this.emitter.remove(this);
		}
		else
		{
			this.sprite.move(
				getVectFromSpeedAndAngle(
					this.angle,
					this.speed
				),
				delta
			)
		}
	}
	
});
