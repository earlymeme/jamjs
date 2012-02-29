#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  lint_error_parser.py
#  
#  Copyright 2012 yetanotherportfolio.fr
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

import sys

in_file_name = 'lint_error.txt'

ERRORS = [
	'Illegal tab in whitespace before',
	'Missing space before',
	'Missing space after',
	'Extra space at end of line',
	'Extra space after',
	'Extra space before',
	'Illegal tab in comment',
]

def parse_errors (in_file):
	""" Function doc """
	
	bad_errors = []
	
	for line in in_file:
		
		in_error = False
		for error in ERRORS:
			if line.find(error) >= 0:
				in_error = True
		
		if not in_error:
			bad_errors.append(line)
	
	return bad_errors

def main():
	
	global in_file_name
	
	if len(sys.argv) == 2:
		in_file_name = sys.argv[1]
	
	in_file = open(in_file_name)
	bad_errors = parse_errors(in_file)
	in_file.close()
	
	for error in bad_errors:
		print error,
	
	return 0

if __name__ == '__main__':
	main()

