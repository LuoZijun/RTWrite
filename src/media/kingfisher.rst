翠鸟
======

:Date: 07/11 2015
:Tag: auth, token, image

.. contents::

.. image:: https://gitlab.com/LuoZijun/kingfisher/raw/master/kingfisher.jpg
    :height: 500px
    :width: 500px

The paradise kingfishers of New Guinea have unusually long tails for the group.


介绍
------

`翠鸟` 项目提供华图题库基于HTTP协议JsonRPC格式的身份认证服务，以及基于密码学的验证码验证服务。


基于密码学的Token
-------------------

大部分时候，当服务器需要对http请求做身份识别的时候，我们往往是这样做的:

*   对用户的身份信息做一次散列计算，求得该份信息的指纹。
*   使用Cache服务器来存储用户的身份信息，身份指纹作为键，身份信息作为值(在一个分布式环境，这点尤为重要)。
*   将用户身份指纹写进HTTP Response里面，以便用户再下次请求时，携带该指纹信息(一般是写在Cookies里面，有些时候也可以作为一个Query参数跟随在URI后面)。
*   从Http Request里面提取出身份指纹, 并前往 Cache服务器提取该指纹对应的用户信息。


我们可以注意到，对身份信息的验证，上面的方法走了一次网络I/O。虽说大部分的Cache服务器支持高并发和快速响应（得益于高速存储介质内存和简单格式BTree/HashMap），但是毕竟还是走了一次I/O不是？

如果想省去这歌I/O操作，最简单的办法就是直接把用户身份信息存储在 HTTP Response里面去，但是这样就不安全了，我们之所以计算 身份信息指纹，无非就是为了避免这些信息直接暴露出去。

那么这就是一个信息的保密问题，对于这个问题，密码学显然更拿手。

我们可以使用 `AES` 等加密手段对用户的身份信息加密，然后把这段加密数据 写进 HTTP Response里面，用户在下次请求时，会附带过来，而我们可以对该 加密过的数据进行逆向操作，得到原始的 用户身份信息，这样一来，中间的网络I/O似乎就显得毫无必要。

也许有人会问：“Cache服务器大部分是支持过期时间机制的，用户的session是有时长限制的，那么基于密码学的 session 如何做到这点？因为它总是可以被正确解密。”

的确如此，但是我们可以往用户的身份信息里面追加一个 `"{"ctime": time.time() }"` 字段似乎就可以解决该问题，当我们解密后，只要计算下 `ctime`  距离当前时间的差距就可以判断 该份 身份信息是否还有效。

以下是一份Python语言的加密和解密代码:

.. code:: python

    #!/usr/bin/env python
    #coding: utf8

    import base64
    import hashlib
    import binascii
    from Crypto import Random
    from Crypto.Cipher import AES

    # DO NOT EDIT!
    SECRET_KEY = '#e!k6)6gnm)79rtvam0!f@h_-wn9-a#5ft2g(kl8uxfo5iv_1@'

    class AESCipher(object):
        def __init__(self, key): 
            self.bs = 32
            self.key = hashlib.sha256(key.encode()).digest()
            #self.key = key

        def encrypt(self, raw):
            raw = self._pad(raw)
            iv = Random.new().read(AES.block_size)
            cipher = AES.new(self.key, AES.MODE_CBC, iv)
            # return base64.b64encode(iv + cipher.encrypt(raw))
            return binascii.b2a_hex(iv + cipher.encrypt(raw))

        def decrypt(self, enc):
            #enc = base64.b64decode(enc)
            enc = binascii.a2b_hex(enc)

            iv = enc[:AES.block_size]
            cipher = AES.new(self.key, AES.MODE_CBC, iv)
            return self._unpad(cipher.decrypt(enc[AES.block_size:])).decode('utf-8')

        def _pad(self, s):
            return s + (self.bs - len(s) % self.bs) * chr(self.bs - len(s) % self.bs)

        @staticmethod
        def _unpad(s):
            return s[:-ord(s[len(s)-1:])]

    def encode (data):
        aes = AESCipher(SECRET_KEY)
        return aes.encrypt(data)
    def decode(token):
        aes = AESCipher(SECRET_KEY)
        return aes.decrypt(token)

    def test():
        aes = AESCipher(SECRET_KEY)
        print aes.encrypt(u'{"openid":12, "name":"bbc1000", "expires": 201516554455}')
        # Like this:
        # 2d27414365a623cc36ce277902af4a442f42bd7f21f8ef44466376f51294ec561ffaf8f68edca9774ee3491957ca2d31


基于密码学的验证码验证
-----------------------

原理同上，当用户点击 `注册` 按钮时，将向服务器请求 验证码，服务器返回的格式大概是这个样子:



.. code:: json

    {
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA==", 
        "token":"2d27414365a623cc36ce277902af4a442f42bd7f21f8ef44466376f51294ec561ffaf8f68edca9774ee3491957ca2d31"
    }

这时，再把 `image` 里面的 base64编码过的图片数据 写进 HTML `img` 标签当中的 `src` 属性里面去，这时验证码图片将得到呈现。

在 发送 注册表单资料时，需要附带 请求验证码图片时返回的 `token` 字段数据，服务器会解码 `token` 数据里面携带的 验证码图片 里面所含的文字信息，并跟 用户输入进来的 验证码 进行对比。

同样，该 `token` 在生成时，可以加入 生成验证码时的时间戳, 据此来判断一个 `token` 是否已经逃离了 生命周期。