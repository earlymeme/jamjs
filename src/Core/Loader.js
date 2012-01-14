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
