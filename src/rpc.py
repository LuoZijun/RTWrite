#!/usr/bin/env python
#-*- coding:utf-8 -*-

from jsonrpc2 import JsonRpc

def index(*args):
	return ["test.txt", "test2.rst"]

def rpc():
	rpc = JsonRpc()
	rpc['index'] = index
	return rpc