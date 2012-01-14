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
