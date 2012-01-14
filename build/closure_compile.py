#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       closure_compile.py
#       
#       Copyright 2011 
#       
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.
#       
#       

import httplib, urllib, sys, re, os.path

#WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS or ADVANCED_OPTIMIZATIONS, NONE
DEFAULT_COMPILATION_LEVEL = None

#TODO
DEFAULT_OUT_FILE_PATERN = '%(basename)s.min.%(ext)s'

def get_text(filename, basedir):
	""" include files """
	content = open(os.path.join(basedir, filename))
	
	print filename
	
	text = ''
	for line in content:
		matches = re.findall(r'^#include\s.(.*).;$', line)
		if len(matches) == 1:
			text += get_text(matches[0], basedir)
		else:
			text += line
	
	return text

def main():
	
	basedir = os.path.dirname(sys.argv[1])
	js_code = get_text(os.path.basename(sys.argv[1]), basedir)
	
	if DEFAULT_COMPILATION_LEVEL is None:
		data = js_code
	else:
		# build param
		params = urllib.urlencode([
			('js_code', js_code),
			('compilation_level', DEFAULT_COMPILATION_LEVEL),
			('output_format', 'text'),
			('output_info', 'compiled_code'),
		])
	
		# send the request to closure
		headers = { "Content-type": "application/x-www-form-urlencoded" }
		conn = httplib.HTTPConnection('closure-compiler.appspot.com')
		conn.request('POST', '/compile', params, headers)
		response = conn.getresponse()
		data = response.read()
		#print data
		conn.close
	
	# write the min file
	out_file_name = '.'.join(sys.argv[1].split('.')[:-1]) + '.min.' + sys.argv[1].split('.')[-1]
	
	if len(sys.argv) >= 3:
		out_file_name = sys.argv[2]
	
	out_file = open(out_file_name, 'w')
	out_file.write(data)
	out_file.close()
	return 0

if __name__ == '__main__':
	main()
