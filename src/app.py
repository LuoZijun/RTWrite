#!/usr/bin/env python
#-*- coding:utf-8 -*-

# termcolor.colored( '>> hi', 'red' )
import termcolor
import json, time

from wsgiref.validate import validator
from wsgiref.simple_server import make_server

import rpc

RPC = rpc.rpc()


# Our callable object which is intentionally not compliant to the
# standard, so the validator is going to break
def application(environ, start_response):
    print ""
    status = '200 OK' # HTTP Status
    headers = [('Content-type', 'application/json')] # HTTP Headers
    request_method = environ['REQUEST_METHOD']
    start_response(status, headers)

    if "HTTP_COOKIES" not in environ: environ['HTTP_COOKIES'] = ""

    # This is going to break because we need to return a list, and
    # the validator is going to inform us
    try:

        http_body = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        environ['HTTP_REQUEST_BODY'] = http_body
        rpc_request = json.loads(http_body)
    except:
        rpc_request = {}

    if "method" not in rpc_request: rpc_request['method'] = ""
    if "id" not in rpc_request: rpc_request['id'] = None
    if "params" not in rpc_request: rpc_request['params'] = []
    # DEBUG
    print termcolor.colored(u"%s\n>>>>>> id: %s\n        ➜        %s(%s)" %(
        time.strftime("%m/%d %Y %H:%M:%S %z", time.localtime()), 
        str(rpc_request['id']), str(rpc_request['method']), 
        json.dumps(rpc_request['params']) ), "yellow")
    # 嵌入 MySQL Pools
    rpc_request['params'].append( {"env": environ, "response": {"headers": headers} } )
    try:
        rpc_response = RPC( rpc_request )
        if rpc_response == None: rpc_response = {}
    except:
        rpc_response = {'jsonrpc': '2.0', 'id': None, 'error': {'message': 'Internal error', 'code': -32603}}

    if "id" not in rpc_response: rpc_response['id'] = None
    if "error" not in rpc_response: rpc_response['error'] = {}
    if "result" not in rpc_response: rpc_response['result'] = ""
    # DEBUG
    print termcolor.colored(u"%s\n<<<<<< id: %s\n        ➜        result: %s\n        ➜        error: %s" %(
        time.strftime("%m/%d %Y %H:%M:%S %z", time.localtime()), 
        str(rpc_response['id']), json.dumps(rpc_response['result']), 
        json.dumps(rpc_response['error']) ), "green")

    return [ json.dumps(rpc_response) ]


# This is the application wrapped in a validator
validator_app = validator(application)

ip = "0.0.0.0"
port = 8000

httpd = make_server(ip, port, validator_app)
print termcolor.colored("\n@@ Listening on %s:%d...."% (ip, port), 'blue')
httpd.serve_forever()
