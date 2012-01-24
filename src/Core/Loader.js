var Loader = Class.extend(
{
	items: null,
	nb_loaded: 0,
	
	id: -1,
	
	init: function (_items) 
	{
		//this.items = items ? items : [];
		
		this.items = [];
		if (_items && _items.length > 0)
		{
			for (var k in _items)
			{
				this.items.push(_items[k]);
			}
		}
		
		this.id = rand_int(1, 100);
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
				if (this.items[i] != this)
				{
					this.items[i]._post_onload = this.items[i].onload;
					this.items[i].onload = function() {self._load_update.apply(self, arguments)};
					this.items[i].load();
				}
			}
		}
	},
	
	load_update: function () {},
	_load_update: function ()
	{
		this.items[this.nb_loaded]._post_onload()
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
