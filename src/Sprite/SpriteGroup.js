var SpriteGroup = Loader.extend(
{
	items: null,
	
	init: function () 
	{
		this.items = [];
	},
	
	update: function(delay)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			this.items[i]._update(delay);
		}
	},
	_update: function (delay) 
	{
		this.update(delay);
	},
	
	draw: function(canvas)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			this.items[i]._draw(canvas);
		}
	},
	_draw: function (canvas) 
	{
		this.draw(canvas);
	},
	
	remove: function(item)
	{
		var pos = this.items.indexOf(item)
		if (pos >= 0)
		{
			this.items.splice(pos, 1);
		}
	}
});
