#!/usr/bin/env python
#-*- coding:utf-8 -*-

from jsonrpc2 import JsonRpc

def index(*args):
    print args
    return ["test.txt", "test2.rst"]


def create_file(*args):
    print args
    return "test response."

def remove_file(*args):
    print args
    return "test response."    

def update_file(*args):
    print args
    return "test response."


def rpc():
    rpc = JsonRpc()
    rpc['index'] = index
    return rpc

