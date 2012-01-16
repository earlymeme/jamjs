var Sprite = Class.extend(
{
	//image
	img: null,
	rect: null,
	angle: 0,
	
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
	
	onload: function () {},
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
		this.img.onload = function() {self._onload.apply(self, arguments)};
		this.img.src = this.config['src'];
	},
	
	_blit: function (canvas) 
	{
		//see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
		canvas.ctx.drawImage(
			this.img, //image
			this.rect.size.x*this.anim_column, //sx
			this.rect.size.y*this.config['anim'][this.current_anim]['row'], //sy
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
		if (this.angle != 0)
		{
			canvas.ctx.save();
			
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
		
		this._blit(canvas);
		
		if (this.angle != 0)
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
		this.update();
	},
	
	move: function (vect)
	{
		this.rect.pos.x += vect.x;
		this.rect.pos.y += vect.y;
	},
	
	clone: function ()
	{
		var config = this.config;
		var rect = this.rect.clone();
		var x = rect.size.x;
		var y = rect.size.y;
		
		//swap size because _onload wil swap it
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
	collideRect: function (pos, size)
	{
		var x1 = (this.rect.pos.x < pos.x && this.rect.pos.x + this.rect.size.x >= pos.x);
		var y1 = (this.rect.pos.y < pos.y && this.rect.pos.y + this.rect.size.y >= pos.y);
		var x2 = (pos.x < this.rect.pos.x && pos.x + size.x >= this.rect.pos.x);
		var y2 = (pos.y < this.rect.pos.y && pos.y + size.y >= this.rect.pos.y);
		
		return (x1 || x2) && (y1 || y2);
	},
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	collideSprite: function (sprite)
	{
		return this.collideRect(
			sprite.rect.pos,
			sprite.rect.size
		);
	}
});
