var SpriteGroup = Loader.extend(
{
	init: function () 
	{
	},
	
	loader: null,
	
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
		var pos = items.indexOf(item)
		if (pos >= 0)
		{
			items.splice(pos, 1);
		}
	}
});
