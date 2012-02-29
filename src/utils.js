/**
 * random number between min and max (both side inclusive).
 * @param {Number} min the minimum value (include).
 * @param {Number} max the maximum value (include).
 * @return {Number} a number between min and max.
 */
function rand_int(min, max)
{
//	return min + Math.floor(Math.random()*(Math.abs(min)+max+1));
	return Math.floor(min + (Math.random()*(max-min+1)));
}

function getVectFromSpeedAndAngle(angle, speed)
{
	var vect = new Vector();
	
	vect.x = Math.cos(Math.PI * angle / 180) * speed;
	vect.y = -Math.sin(Math.PI * angle / 180) * speed;
	
	return vect;
}

function extend_array(src, dest)
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
