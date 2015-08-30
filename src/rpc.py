#!/usr/bin/env python
#-*- coding:utf-8 -*-

from jsonrpc2 import JsonRpc

import os,sys

def index(*args):
    print args
    return [f for f in os.listdir("media") if f[-4:] != ".log"]

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
    rpc['update'] = update_file
    return rpc

