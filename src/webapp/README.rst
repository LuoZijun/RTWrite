开发笔记
===============

:Date: 2015/08/21

.. contents::

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
