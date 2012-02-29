var ParticleEmitter = Class.extend({
	
	sprite: null,
	group: null,
	particles: [],
	
	start: null, //start position
	nb_spread: 0, //number of particle create per cycle
	life_time: 0, //life of particules
	angle: 0,
	speed: 0,
	angle_rand: 0,
	speed_rand: 0,
	life_time_rand: 0,
	
	init: function(
		sprite, start, nb_spread,
		life_time, speed, angle, speed_rand, angle_rand, life_time_rand
	)
	{
		var self = this;
		
		this.sprite = sprite;
		this.group = new SpriteGroup();
		this.group.update = function() {self.update.apply(self, arguments);};
		
		this.start = start || new Vector(0,0);
		this.nb_spread = nb_spread || 1;
		this.life_time = life_time || 60;
		this.angle = angle || 0;
		this.speed = speed || 1;
		this.speed_rand = speed_rand || 0;
		this.angle_rand = angle_rand || 0;
		this.angle_rand = angle_rand || 0;
		this.life_time_rand = life_time_rand || 0;
	},
	
	update: function (delta)
	{
		var i=0;
		
		for (i=0; i < this.particles.length; i++)
		{
			this.particles[i].update(delta);
		}
		
		for (i=0; i < this.nb_spread; i++)
		{
			this.add();
		}
	},
	
	add: function ()
	{
		var new_sprite = this.sprite.clone();
		new_sprite.rect.pos.x = this.start.x;
		new_sprite.rect.pos.y = this.start.y;
		
		var angle = this.angle;
		var speed = this.speed;
		var life_time = this.life_time;
		
		if (this.angle_rand != 0)
		{
			angle = rand_int(
				angle - (this.angle_rand/2),
				angle + (this.angle_rand/2)
			);
		}
		
		if (this.speed_rand != 0)
		{
			speed = rand_int(
				speed - (this.speed_rand/2),
				speed + (this.speed_rand/2)
			);
		}
		
		if (this.life_time_rand != 0)
		{
			life_time = rand_int(
				life_time - (this.life_time_rand/2),
				life_time + (this.life_time_rand/2)
			);
		}
		
		var new_particle = new Particle(
			this,
			new_sprite,
			life_time,
			speed,
			angle,
			new Vector(0,0)
		);
		
		this.group.items.push(new_particle.sprite);
		this.particles.push(new_particle);
	},
	
	remove: function (_particle)
	{
		var pos = this.particles.indexOf(_particle);
		if (pos >= 0)
		{
			this.group.remove(_particle.sprite);
			this.particles.splice(pos, 1);
		}
	}
});
