开发笔记
===============

:Date: 2015/08/21

.. contents::


部署前后端应用
-----------------

1.  设置前端静态文件路径

.. NOTE:: 在 `Nginx` (或者其它WEB服务器)上面设置 `Loction` 指向 `RTWrite/src/` 目录。出于安全因素，同时请不要忘记加上一个访问限制，对 Python 文件静止访问。

::

    # Nginx Location Config.
    Location / {
        root    RTWrite/src/;
        index   index.html;
    }
    Location /static {
        root    RTWrite/src/static;
    }
    Location /service {
        # app.py 监听的地址
        proxy_pass  http://127.0.0.1:8000;
    }
    Location ~ (.*)\.py {
        deny    all;
    }
    Location ~ /\.git(.*)$ {
        deny    all;
    }



2.  运行后端 RPC 服务

.. code:: base
    
    python app.py



