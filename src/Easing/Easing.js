//TODO use:
//https://github.com/jeremyckahn/shifty/blob/master/src/shifty.formulas.js
var Easing = Class.extend({
	
	target: null,
	time: 0,
	properties: {},
	endCallback: null,
	
	base_properties: {},
	current_time: 0,
	
	init: function (target, time, properties, endCallback)
	{
		this.target = target;
		this.time = time;
		this.properties = properties;
		this.endCallback = endCallback;
		
		this._init_base_properties();
	},
	
	_init_base_properties: function ()
	{
		this.base_properties = {};
		for (var k in this.properties)
		{
			this.base_properties[k] = this.target[k];
		}
	},
	
	update: function (delta)
	{
		this.current_time += delta;
		
		if (this.current_time < this.time)
		{
			var new_val;
			for (var k in this.properties)
			{
				new_val = this.compute_val(
					(this.properties[k] - this.base_properties[k]),
					(this.current_time / this.time)
				);
				this.target[k] = this.base_properties[k] + new_val;
			}
		}
		else
		{
			for (var k in this.properties)
			{
				this.target[k] = this.properties[k];
			}
			
			if (this.endCallback)
			{
				this.endCallback();
			}
		}
	},
	
	compute_val: function (val, percent)
	{
		return val * this.linear(percent);
	},
	
	linear: function (x)
	{
		return x;
	}
});
