---
toc: true
title: IDEA中调试的技巧
date: 2021-12-31 
tags:
  - IntelliJ IDEA
---

  最近做项目过程中发现自己在代码调试这一块掌握不到位，项目报错后，无法快速定位问题发生的位置，因此，今天抽时间跟着JetBrains的官网学习并总结IDEA调试的方法和技巧。

<!--more-->

  调试的常用快捷键：

| 操作                                                         | 快捷键        |
| ------------------------------------------------------------ | ------------- |
| **设置或取消行断点（也可以取消其它类型的断点）**             | ctrl+f8       |
| **打开调试模式**                                             | shift+f9      |
| **step over(不会进入方法内部)**                              | f8            |
| **step into(会进入方法内部，进入的是我们自己写的方法内部，不会进入源代码方法内部)** | f7            |
| **force step into(会进入自定义方法或源代码方法内部)**        | alt+shift+f7  |
| terminate a debugger(关闭调试模式)                           | ctrl+f2       |
| **resume program(恢复程序)**                                 | f9            |
| **恢复程序，并使得程序运行到鼠标所在行停住（不用重新设置一个断点）** | alt+f9        |
| view breakpoints(可以设置断点的条件、是否禁用等)             | ctrl+shift+f8 |
| 调试模式下计算表达式的值，同时也可以自定义变量的值进行调试   | alt+f8        |
| restart a debugger(重启调试模式)                             | ctrl+f5       |
| show/hide debug tool window(显示或隐藏调试窗口)              | alt+5         |
| **step out(跳出)**                                           | shift+f8      |
| **Smart Step Into(有多个方法的时候可以自己选择先进入哪一个方法)** | shift+f7      |

断点有四种类型，分别是Line breakpoints、Method breakpoints、Field watchpoints、Exception breakpoints，最常用的是Line breakpoints（行断点），下面分别是官网对四种断点的介绍：

- Line breakpoints:

> suspend the program upon reaching the line of code where the breakpoint was set. This type of breakpoints can be set on any executable line of code.

- Method breakpoints:

>suspend the program upon entering or exiting the specified method or one of its implementations, allowing you to check the method's entry/exit conditions

- Field watchpoints

> suspend the program when the specified field is read or written to. This allows you to react to（对...起反应） interactions(交互) with specific instance variables. For example, if at the end of a complicated(复杂的) process you are ending up with an obviously wrong value on one of your fields, setting a field watchpoint may help determine the origin of the fault

- Exception breakpoints

> suspend the program when `Throwable` or its subclasses are thrown. They apply globally to the exception condition and do not require a particular source code reference.

Mute BreakPoints: mute有”静音“之意，即打开项目或者调试模式不会触发断点

临时断点（shift+alt+点击分割线的左侧）：仅可调试一次，调试完后会消失

黄色的断点(shift+点击分割线的左侧)：表明是Non-suspending，即程序运行过程中不会在该处停住

禁用或启用断点（alt+点击断点）

Drop Frame:断点回退（回退到上一个方法的调用处）

一般把光标停在想要查看的参数上来查看该参数的具体信息

