开发笔记
===============

:Date: 2015/08/21

.. contents::

部署
---------

1.  设置前端静态文件路径

.. Note:: 
    
    在 `Nginx` (或者其它WEB服务器)上面设置 `Loction` 指向 `RTWrite/src/` 目录。
    出于安全因素，同时请不要忘记加上一个访问限制，对 Python 文件静止访问。

::

    # Nginx Location Config.
    Location / {
        root    RTWrite/src/;
        index   index.html;
    }
    Location /static {
        root    RTWrite/src/static;
        
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



React事件
---------------------

文档: https://facebook.github.io/react/docs/events.html

**Keyboard Events**

Event names::

    onKeyDown onKeyPress onKeyUp

Properties::

    boolean altKey
    Number charCode
    boolean ctrlKey
    function getModifierState(key)
    String key
    Number keyCode
    String locale
    Number location
    boolean metaKey
    boolean repeat
    boolean shiftKey
    Number which

**Mouse Events**

Event names::

    onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
    onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
    onMouseMove onMouseOut onMouseOver onMouseUp


The onMouseEnter and onMouseLeave events propagate from the component being left to the one being entered instead of ordinary bubbling and do not have a capture phase.


Properties::

    boolean altKey
    Number button
    Number buttons
    Number clientX
    Number clientY
    boolean ctrlKey
    function getModifierState(key)
    boolean metaKey
    Number pageX
    Number pageY
    DOMEventTarget relatedTarget
    Number screenX
    Number screenY
    boolean shiftKey


**Focus Events**

Event names::

    onFocus onBlur

Properties::

    DOMEventTarget relatedTarget


**Form Events**

Event names::

    onChange onInput onSubmit

For more information about the onChange event, see Forms.

**UI Events**

Event names::

    onScroll

Properties::

    Number detail
    DOMAbstractView view


键盘输入事件处理
----------------------------

输入法编辑器(IME)
^^^^^^^^^^^^^^^^^^^^^

IME Key Code: 229, Opera: 197

console.log("Event Type: ", e.type, ",\tKeyCode: ", e.which, ",\tTime: ", e.timeStamp);