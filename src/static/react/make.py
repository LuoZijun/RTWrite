#!/usr/bin/env python
#-*- coding:utf-8 -*-

"""
    @@  编译 React JSX .
     
     Note:
            需要使用 npm 安装 react-tools.
            $ npm install -g react-tools

            Document: https://facebook.github.io/react/downloads.html
            
    Command:
            $ jsx src/ build/
"""
import os, sys, time
import slimit

#BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BASE_DIR = os.path.dirname(os.path.join(os.getcwd(), __file__))

SRC_PATH = os.path.join(BASE_DIR, "src")
DES_PATH = os.path.join(BASE_DIR, "build")

if os.path.exists(DES_PATH) == False:
	os.system("mkdir %s" %(DES_PATH) )

# .module-cache
def sync_dirs(src, des):
    # 同步目录
    for e in os.listdir(src):
        if os.path.isdir(os.path.join(src, e)) == True and e != ".module-cache":
            if os.path.exists(os.path.join(des, e)) == True:
                if os.path.isdir( os.path.join(des, e) ) == False:
                    print "备份文件: mv %s %s" %(os.path.join(des, e), os.path.join(des, e) + ".bak")
                    os.system("mv %s %s" %(os.path.join(des, e), os.path.join(des, e) + ".bak")  )
                    print "创建目录: mkdir %s" % (os.path.join(des, e) )
                    os.system("mkdir %s" % (os.path.join(des, e) ) )
            elif os.path.exists(os.path.join(des, e)) == False:
                print "创建目录: mkdir %s" % (os.path.join(des, e) )
                os.system("mkdir %s" % (os.path.join(des, e) ) )
            else:
                print e
            sync_dirs(os.path.join(src, e), os.path.join(des, e) )
        else:
            pass

def compileJSX(src, des):
    #for root, dirs, files in os.walk(src):
    #    for name in files:
    for e in os.listdir(src):
        if os.path.isdir(os.path.join(src, e)) == True and e != ".module-cache":
            compileJSX(os.path.join(src, e), os.path.join(des, e) )
        elif os.path.isfile(os.path.join(src, e)) == True:
            if e.split(".")[-1]  in ["js", "jsx"]:
                print "编译: $ jsx %s %s" %( os.path.join(src, e), des )
                os.system("jsx %s > %s" %( os.path.join(src, e), os.path.join(des, e) ) )
                compress( os.path.join(des, e),  os.path.join(des, e) )
            else:
                print "****  忽略 文件: %s" % ( os.path.join(src, e) )

def compress(src_js, des_js):
    # 压缩 JS 文件
    # https://pypi.python.org/pypi/slimit
    return True
    print "***压缩JS中*** ... ..."
    target = src_js
    print ":: 目标: %s" %(target)
    uncompress = open( target, "r" ).read()
    jsmin = slimit.minify(uncompress, mangle=True, mangle_toplevel=True)
    print jsmin
    open( target, "w").write( jsmin )


def work():
    sync_dirs(SRC_PATH, DES_PATH)
    compileJSX(SRC_PATH, DES_PATH)

print ":: running ..."
work()
