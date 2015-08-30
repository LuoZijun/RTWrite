#!/usr/bin/env python
#-*- coding:utf-8 -*-

from jsonrpc2 import JsonRpc

import os,sys

def index(*args):
    return [f for f in os.listdir("media") if f[-4:] != ".log"]

def fetch_file(file_name):
    if os.path.exists("media/"+file_name) and os.path.isfile("media/"+file_name):
        return {"content": open("media/"+file_name, "r").read(), "records": open("media/"+file_name+".log", "r").read() }
    else:
        raise Exception(u"你要找的文件不存在")

def create_file(file_name):
    if os.path.exists("media/"+file_name) and os.path.isfile("media/"+file_name):
        raise Exception(u"文件名已存在")
    else:
        open("media/"+file_name, "w").write("")
        open("media/"+file_name+".log", "w").write("")
        return True

def remove_file(*args):
    print args
    return "test response."

def update_file(file_name, changeset):
    name = "media/%s" %(file_name)
    records = name + ".log"
    if changeset[-1] != "\n":
        changeset = changeset + "\n"

    return open(records, "a").write(changeset+"\n")

def rpc():
    rpc = JsonRpc()
    rpc['index'] = index
    rpc['update'] = update_file
    rpc['fetch'] = fetch_file
    return rpc

