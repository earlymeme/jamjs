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
