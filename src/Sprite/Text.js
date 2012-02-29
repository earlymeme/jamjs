var Text = Loadable.extend(
{
	TYPE_STROKE: 1,
	TYPE_FILL: 2,
	
	pos: null,
	text: '',
	type: 2, //TYPE_FILL
	style: {fillStyle: '#000', lineWidth:1, font:'12px sans-serif'},
	
	init: function () 
	{
		this.pos = new Vector();
	},
	
	draw: function (canvas)
	{
		canvas.ctx.save();
		
		var s;
		for (s in this.style)
		{
			canvas.ctx[s] = this.style[s];
		}
		
		if (this.type == this.TYPE_FILL)
		{
			canvas.ctx.fillText(this.text, this.pos.x, this.pos.y);
		}
		else
		{
			canvas.ctx.strokeText(this.text, this.pos.x, this.pos.y);
		}
		
		canvas.ctx.restore();
	},
	_draw: function (canvas)
	{
		this.draw(canvas);
	},
	
	update: function (delay) {},
	_update: function (delay)
	{
		this.update();
	},
	
	move: function (vect)
	{
		pos.x += vect.x;
		pos.y += vect.y;
	},
	
	clone: function ()
	{
		var newone = new Text();
		newone.pos = this.pos;
		newone.text = this.text;
		newone.type = this.type;
		newone.style = this.style;
		
		return newone;
	}
});
