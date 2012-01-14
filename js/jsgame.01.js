function Canvas(canvas_elem, size) 
{
	var self = this;
	var init = function (canvas_elem, size) 
	{
		self.ctx = canvas_elem.getContext("2d");
		self.size = size;
	};
	
	this.ctx = null;
	this.size = null;
	
	this.clear = function (color)
	{
		if (color)
		{
			self.ctx.fillStyle = color;
			self.ctx.fillRect(0, 0, self.size.x, self.size.y);
		}
		else
		{
			self.ctx.clearRect(0, 0, self.size.x, self.size.y);
		}
	};
	
	init(canvas_elem, size);
}
function Loader(items) 
{
	var self = this;
	var init = function (items) 
	{
		self.items = items ? items : [];
	};
	
	this.items = [];
	this.nb_loaded = 0;
	
	this.load = function ()
	{
		if (self.items.length == 0)
		{
			self._onload();
		}
		else
		{
			for (var i = 0; i < self.items.length; i++)
			{
				self.items[i].onload = self._load_update;
				self.items[i].load();
			}
		}
	};
	
	this.load_update = function () {};
	this._load_update = function ()
	{
		self.nb_loaded += 1;
		
		if (self.nb_loaded == self.items.length)
		{
			self._onload();
		}
		else
		{
			self.load_update();
		}
	};
	
	this.onload = function () {};
	this._onload = function ()
	{
		self.items = [];
		self.onload();
	};
	
	init(items);
}

function Vector(x, y)
{
	var self = this;
	var init = function () 
	{
		if (x) self.x = x;
		else self.x = 0;
		
		if (y) self.y = y;
		else self.y = 0;
	};
	
	this.x = 0;
	this.y = 0;
	
	this.toString = function ()
	{
		return self.x +'/'+ self.y;
	};
	
	init(x, y);
}
function Rect(pos, size) 
{
	var self = this;
	var init = function (pos, size) 
	{
		if (pos) self.pos = pos;
		else self.pos = new Vector();
		
		if (size) self.size = size;
		else self.size = new Vector();
	};
	
	this.pos = null;
	this.size = null;
	
	this.left = function ()
	{
		return self.pos.x;
	};
	
	this.right = function ()
	{
		return self.pos.x + self.size.x;
	};
	
	this.top = function ()
	{
		return self.pos.y;
	};
	
	this.bottom = function ()
	{
		return self.pos.y + self.size.y;
	};
	
	this.center = function (pos)
	{
		if(pos)
		{
//			self.pos.x = pos.x - size.x/2;
//			self.pos.y = pos.y - size.y/2;
			self.pos.x = pos.x - self.size.x/2;
			self.pos.y = pos.y - self.size.y/2;
		}
		
		return new Vector(
			self.pos.x + self.size.x/2,
			self.pos.y + self.size.y/2
		);
	};
	
	this.clone = function ()
	{
		return new Rect(
			new Vector(self.pos.x, self.pos.y),
			new Vector(self.size.x, self.size.y)
		);
	};
	
	this.toString = function ()
	{
		return self.pos.toString() +' - '+ self.size.toString();
	};
	
	init(pos, size);
}

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
function SpriteGroup()
{
	var self = this;
	var init = function () 
	{
	};
	
	this.sprites = [];
	this.loader = null;
	
	this.update = function(delay)
	{
		for (var i = 0; i < self.sprites.length; i++)
		{
			self.sprites[i]._update(delay);
		}
	};
	this._update = function (delay) 
	{
		self.update(delay);
	};
	
	this.draw = function(canvas)
	{
		for (var i = 0; i < self.sprites.length; i++)
		{
			self.sprites[i]._draw(canvas);
		}
	};
	this._draw = function (canvas) 
	{
		self.draw(canvas);
	};
	
	this.onload = function () {};
	this._onload = function ()
	{
		self.onload();
	};
	
	this.load = function ()
	{
		self.loader = new Loader();
		self.loader.items = self.sprites;
		self.loader.onload = self._onload;
		self.loader.load();
	};
	
	this.remove = function(item)
	{
		var pos = this.sprites.indexOf(item)
		if (pos >= 0)
		{
			this.sprites.splice(pos, 1);
		}
	};
	
	init();
}
function Text() 
{
	var self = this;
	var init = function () 
	{
		self.pos = new Vector();
	};
	
	this.TYPE_STROKE = 1;
	this.TYPE_FILL = 2;
	
	this.pos = null;
	this.text = '';
	this.type = this.TYPE_FILL;
	this.style = {fillStyle: "#fff", lineWidth:1, font:"12px sans-serif"};
	
	this.onload = function () {};
	this._onload = function () 
	{
		self.onload();
	};
	
	this.load = function ()
	{
		// nothing to load
		self.onload();
	};
	
	this.draw = function (canvas)
	{
		canvas.ctx.save();
		
		var s;
		for (s in self.style)
		{
			canvas.ctx[s] = self.style[s];
		}
		
		if (self.type == self.TYPE_FILL)
		{
			canvas.ctx.fillText(self.text, self.pos.x, self.pos.y);
		}
		else
		{
			canvas.ctx.strokeText(self.text, self.pos.x, self.pos.y);
		}
		
		canvas.ctx.restore();
	};
	this._draw = function (canvas)
	{
		self.draw(canvas);
	};
	
	this.update = function (delay) {}
	this._update = function (delay)
	{
		self.update();
	};
	
	this.move = function (vect)
	{
		this.pos.x += vect.x;
		this.pos.y += vect.y;
	};
	
	this.clone = function ()
	{
		var newone = new Text();
		newone.pos = self.pos;
		newone.text = self.text;
		newone.type = self.type;
		newone.style = self.style;
		
		return newone;
	};
	
	init();
}

function Scene(canvas) 
{
	var self = this;
	var init = function () 
	{
		//extend(this, new Loader());
		
		self.canvas = canvas;
		self.group = new SpriteGroup();
		
		self.last_time = new Date().getTime();
	};
	
	this.load = function()
	{
		self.group.onload = self._start;
		self.group.load();
	};
	
	this.background_color = null;
	
	this.canvas = null;
	this.group = null;
	
	this.REFRESH_RATE = 1000 / 30;
	this.interval_id = 0;
	this.last_time = 0;
	this.is_paused = false;
	
	this.start = function(){}
	this._start = function()
	{
		self.start();
		
		//self.interval_id = setInterval(self._update, self.REFRESH_RATE);
		self.is_paused = false;
		self.interval_id = self.set_time_out(0);
	};
	
	this.stop = function()
	{
		//clearInterval(self.interval_id);
		self.is_paused = true;
		clearTimeout(self.interval_id);
	};
	
	this.update = function(delay) {}
	this._update = function()
	{
		var now = new Date().getTime();
		var delay = now - self.last_time;
		
		self.canvas.clear(self.background_color);
		
		self.group.update(delay);
		self.group.draw(self.canvas);
		
		self.update();
		
		var now2 = new Date().getTime();
		self.interval_id = self.set_time_out(now2 - now);
		self.last_time = now;
	};
	
	this.set_time_out = function(frame_time)
	{
		if (self.is_paused != true)
		{
			var millisec = self.REFRESH_RATE - frame_time;
			return setTimeout(self._update, millisec)
		}
	};
	
	init(canvas);
}

/**
 * random number between min and max (both side inclusive)
 */
function rand_int(min, max)
{
	return min + Math.floor(Math.random()*(Math.abs(min)+max+1));
}

function getVectFromSpeedAndAngle(angle, speed)
{
	var vect = new Vector();
	
	vect.x = Math.cos(Math.PI * angle / 180) * speed;
	vect.y = -Math.sin(Math.PI * angle / 180) * speed;
	
	return vect;
}

function extend(src, dest)
{
	var k = null;
	for (k in dest)
	{
		if (src[k] === undefined)
		{
			src[k] = dest[k];
		}
	}
}

function getKeyNum(e)
{
	var keynum;

	if(window.event) // IE
	{
		keynum = e.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}
	
	return keynum;
}
var jsgame = {
};