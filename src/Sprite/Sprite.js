var Sprite = Loadable.extend(
{
	//image
	img: null,
	rect: null,
	angle: 0,
	alpha: 1.0,
	
	// animation
	anim_column: 0,
	timeToNextFrame: 0,
	
	// animation config
	current_anim: 0,
	config: {},
	default_config: {
		src: null,
		size: null,
		anim: [
			{
				fps: 0,
				row: 0,
				first_frame: 0
			}
		]
	},
	
	init: function (config) 
	{
		var i = null;
		this.rect = new Rect();
		this.current_anim = 0;
		this.angle = 0;
		this.anim_column = 0;
		this.timeToNextFrame = 0;
		
		//merge default config with actual config
		extend_array(config, this.default_config);
		for (i in config['anim'])
		{
			extend_array(config['anim'][i], this.default_config['anim'][0]);
		}
		this.config = config;
	},
	
	_onload: function ()
	{
		if (!this.config['size'])
		{
			this.config['size'] = new Vector(
				this.img.width,
				this.img.height
			);
			this.rect.size.x = this.img.width;
			this.rect.size.y = this.img.height;
		}
		else
		{
			var x = this.config['size'].x;
			var y = this.config['size'].y;
			this.config['size'] = new Vector(
				this.img.width,
				this.img.height
			);
			this.rect.size.x = x;
			this.rect.size.y = y;
		}
		
		this.onload();
	},
	
	load: function ()
	{
		var self = this;
		
		this.img = new Image();
		this.img.onload = function() {self._onload.apply(self, arguments);};
		this.img.src = this.config['src'];
	},
	
	_blit: function (canvas) 
	{
		//see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
		canvas.ctx.drawImage(
			this.img, //image
			this.rect.size.x*this.anim_column, //sx
			this.rect.size.y*this.current_anim, //sy
			this.rect.size.x, //sw
			this.rect.size.y, //sh
			this.rect.pos.x, //dx
			this.rect.pos.y, //dy
			this.rect.size.x, //dw
			this.rect.size.y //dy
		);
	},
	
	draw: function (canvas)
	{
		var need_save = this.angle != 0 || this.alpha != 1;
		
		if (need_save)
		{
			canvas.ctx.save();
		}
		
		if (this.angle != 0)
		{
			var tr = new Vector(
				this.rect.pos.x + (this.rect.size.x/2),
				this.rect.pos.y + (this.rect.size.y/2)
			);
			
			//put the rotation point at the center of the sprite
			canvas.ctx.translate(
				tr.x,
				tr.y
			);
			
			//rotate by angle
			canvas.ctx.rotate(this.angle * Math.PI /180);
			
			//put the rotation points back to the origins
			canvas.ctx.translate(
				-tr.x,
				-tr.y
			);
		}
		
		if (this.alpha != 1)
		{
			canvas.ctx.globalAlpha = this.alpha;
		}
		
		this._blit(canvas);
		
		if (need_save)
		{
			canvas.ctx.restore();
		}
	},
	_draw: function (canvas)
	{
		this.draw(canvas);
	},
	
	update: function (delay) {},
	_update: function (delay)
	{
		this.update_anim(delay);
		this.update(delay);
	},
	
	move: function (vect, delta, speed)
	{
		if (!speed) speed = 1;
		if (!delta)
		{
			delta = 1;
		}
		else
		{
			delta = delta/1000.0;
		}
		
		this.rect.pos.x += vect.x * delta * speed;
		this.rect.pos.y += vect.y * delta * speed;
	},
	
	clone: function ()
	{
		var config = this.config;
		var rect = this.rect.clone();
		var x = rect.size.x;
		var y = rect.size.y;
		
		//swap size because _onload will swap it
		//TODO: find better
		rect.size.x = config['size'].x;
		rect.size.y = config['size'].y;
		config['size'].x = x;
		config['size'].y = y;
		
		
		var newone = new Sprite(this.config);
		newone.img = this.img;
		newone.rect = rect;
		newone.angle = this.angle;
		newone.anim_column = this.anim_column;
		newone.timeToNextFrame = this.timeToNextFrame;
		newone.current_anim = this.current_anim;
		
		newone._onload();
		
		return newone;
	},
	
	//-------- ANIMATIONS ----------//
	
	update_anim: function (delay) 
	{
		if (this.config['anim'][this.current_anim]['fps'] > 0)
		{
			this.timeToNextFrame += delay/1000.0;
			
			if (this.timeToNextFrame >= 1/this.config['anim'][this.current_anim]['fps'])
			{
				this.anim_column += 1;
				if (this.anim_column >= this.config['size'].x/this.rect.size.x)
				{
					this.anim_column = this.config['anim'][this.current_anim]['first_frame'];
				}
				
				this.timeToNextFrame = 0;
			}
		}
	},
	
	set_anim: function (anim)
	{
		this.current_anim = anim;
		this.anim_column = 0;
	},
	
	//-------- COLIDE TEST ---------//
	
	/**
	 * return true if the sprite collide the pt
	 */
	collidePoint: function (pt)
	{
		return pt.x >= this.rect.pos.x &&
			pt.x <= this.rect.pos.x + this.rect.size.x &&
			pt.y >= this.rect.pos.y &&
			pt.y <= this.rect.pos.y + this.rect.size.y;
	},
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	collideSprite: function (sprite)
	{
		return this.rect.collide(
			sprite.rect
		);
	}
});
