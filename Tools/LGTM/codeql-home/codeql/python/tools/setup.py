#!/usr/bin/env python

#This file needs to be able to handle all versions of Python we are likely to encounter
#Which is probably 2.6 and upwards

'''Run buildtools/install.py'''

from __future__ import print_function, division

import sys
import os
import subprocess
from python_tracer import getzipfilename


tools = os.path.join(os.environ['SEMMLE_DIST'], "tools")
zippath = os.path.join(tools, getzipfilename())
sys.path = [ zippath ] + sys.path

# these are imported from the zip
from buildtools.discover import discover
import buildtools.install

def main():
    version, root, requirement_files = discover()
    buildtools.install.main(version, root, requirement_files)


if __name__ == "__main__":
    main()
