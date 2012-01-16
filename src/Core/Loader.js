var Loader = Class.extend(
{
	items: [],
	nb_loaded: 0,
	
	init: function (items) 
	{
		this.items = items ? items : [];
	},
	
	load: function ()
	{
		var self = this;
		if (this.items.length == 0)
		{
			this._onload();
		}
		else
		{
			for (var i = 0; i < this.items.length; i++)
			{
				this.items[i].onload = function() {self._load_update.apply(self, arguments)};
				this.items[i].load();
			}
		}
	},
	
	load_update: function () {},
	_load_update: function ()
	{
		this.nb_loaded += 1;
		
		if (this.nb_loaded == this.items.length)
		{
			this._onload();
		}
		else
		{
			this.load_update();
		}
	},
	
	onload: function () {},
	_onload: function ()
	{
		//this.items = [];
		this.onload();
	}
});
