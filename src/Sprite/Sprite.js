function Sprite(config) 
{
	var self = this;
	var init = function (config) 
	{
		var i = null;
		self.rect = new Rect();
		self.current_anim = 0;
		self.angle = 0;
		self.anim_column = 0;
		self.timeToNextFrame = 0;
		
		//merge default config with actual config
		extend(config, self.default_config);
		for (i in config['anim'])
		{
			extend(config['anim'][i], self.default_config['anim'][0]);
		}
		self.config = config;
	};
	
	//image
	this.img = null;
	this.rect = null;
	this.angle = 0;
	
	// animation
	this.anim_column = 0;
	this.timeToNextFrame = 0;
	
	// animation config
	this.current_anim = 0;
	this.config = {};
	this.default_config = {
		src: null,
		size: null,
		anim: [
			{
				fps: 0,
				row: 0,
				first_frame: 0
			}
		]
	};
	
	this.onload = function () {};
	this._onload = function () 
	{
		if (!self.config['size'])
		{
			self.config['size'] = new Vector(
				self.img.width,
				self.img.height
			);
			self.rect.size.x = self.img.width;
			self.rect.size.y = self.img.height;
		}
		else
		{
			var x = self.config['size'].x;
			var y = self.config['size'].y;
			self.config['size'] = new Vector(
				self.img.width,
				self.img.height
			);
			self.rect.size.x = x;
			self.rect.size.y = y;
		}
		
		self.onload();
	};
	
	this.load = function ()
	{
		self.img = new Image();
		self.img.src = self.config['src'];
		self.img.onload = self._onload;
	};
	
	this._blit = function (canvas) 
	{
		//see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-drawimage
		canvas.ctx.drawImage(
			self.img, //image
			self.rect.size.x*self.anim_column, //sx
			self.rect.size.y*self.config['anim'][self.current_anim]['row'], //sy
			self.rect.size.x, //sw
			self.rect.size.y, //sh
			self.rect.pos.x, //dx
			self.rect.pos.y, //dy
			self.rect.size.x, //dw
			self.rect.size.y //dy
		);
	};
	
	this.draw = function (canvas)
	{
		if (self.angle != 0)
		{
			canvas.ctx.save();
			
			var tr = new Vector(
				self.rect.pos.x + (self.rect.size.x/2),
				self.rect.pos.y + (self.rect.size.y/2)
			);
			
			//put the rotation point at the center of the sprite
			canvas.ctx.translate(
				tr.x,
				tr.y
			);
			
			//rotate by angle
			canvas.ctx.rotate(self.angle * Math.PI /180);
			
			//put the rotation points back to the origins
			canvas.ctx.translate(
				-tr.x,
				-tr.y
			);
		}
		
		self._blit(canvas);
		
		if (self.angle != 0)
		{
			canvas.ctx.restore();
		}
	};
	this._draw = function (canvas)
	{
		self.draw(canvas);
	};
	
	this.update = function (delay) {}
	this._update = function (delay)
	{
		self.update_anim(delay);
		self.update();
	};
	
	this.move = function (vect)
	{
		this.rect.pos.x += vect.x;
		this.rect.pos.y += vect.y;
	};
	
	this.clone = function ()
	{
		var config = self.config;
		var rect = self.rect.clone();
		var x = rect.size.x;
		var y = rect.size.y;
		
		//swap size because _onload wil swap it
		//TODO: find better
		rect.size.x = config['size'].x;
		rect.size.y = config['size'].y;
		config['size'].x = x;
		config['size'].y = y;
		
		var newone = new Sprite(self.config);
		newone.img = self.img;
		newone.rect = rect;
		newone.angle = self.angle;
		newone.anim_column = self.anim_column;
		newone.timeToNextFrame = self.timeToNextFrame;
		newone.current_anim = self.current_anim;
		
		newone._onload();
		
		return newone;
	};
	
	//-------- ANIMATIONS ----------//
	
	this.update_anim = function (delay) 
	{
		if (self.config['anim'][self.current_anim]['fps'] > 0)
		{
			self.timeToNextFrame += delay/1000.0;
			
			if (self.timeToNextFrame >= 1/self.config['anim'][self.current_anim]['fps'])
			{
				self.anim_column += 1;
				if (self.anim_column >= self.config['size'].x/self.rect.size.x)
				{
					self.anim_column = self.config['anim'][self.current_anim]['first_frame'];
				}
				
				self.timeToNextFrame = 0;
			}
		}
	};
	
	this.set_anim = function (anim)
	{
		self.current_anim = anim;
		self.anim_column = 0;
	};
	
	//-------- COLIDE TEST ---------//
	
	/**
	 * return true if the sprite collide the pt
	 */
	this.collidePoint = function (pt)
	{
		return pt.x >= self.rect.pos.x &&
			pt.x <= self.rect.pos.x + self.rect.size.x &&
			pt.y >= self.rect.pos.y &&
			pt.y <= self.rect.pos.y + self.rect.size.y;
	};
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	this.collideRect = function (pos, size)
	{
		var x1 = (self.rect.pos.x < pos.x && self.rect.pos.x + self.rect.size.x >= pos.x);
		var y1 = (self.rect.pos.y < pos.y && self.rect.pos.y + self.rect.size.y >= pos.y);
		var x2 = (pos.x < self.rect.pos.x && pos.x + size.x >= self.rect.pos.x);
		var y2 = (pos.y < self.rect.pos.y && pos.y + size.y >= self.rect.pos.y);
		
		return (x1 || x2) && (y1 || y2);
	};
	
	/**
	 * return true if the sprite collide the rect (use bounding box)
	 */
	this.collideSprite = function (sprite)
	{
		return self.collideRect(
			sprite.rect.pos,
			sprite.rect.size
		);
	};
	
	init(config);
}
