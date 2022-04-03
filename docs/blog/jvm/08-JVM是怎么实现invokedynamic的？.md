---
toc: true
title: 08-JVM是怎么实现invokedynamic的？
date: 2022-2-10
tags: [《深入拆解Java虚拟机》] 
categories:
- JVM
---

#### invokedynamic指令
- Java 7引入了invokedynamic指令，用以支持动态语言的方法调用，该指令的调用机制抽象出**调用点**这一个概念，它将调用点（CallSite）抽象成一个Java类，并且将原本由Java虚拟机控制的方法调用以及方法链接暴露给了应用程序，允许应用程序将调用点链接至任意符合条件的方法上
  
<!--more-->

- 方法句柄（MethodHandle）：一个强类型的，能够被直接执行的引用
- 方法句柄的类型（MethodType）：由所指向方法的参数类型以及返回类型组成
- 方法句柄可以通过invokeExact以及invoke来调用
- 方法句柄的调用和反射调用一样，均为间接调用，同样会面临无法内联的问题

#### Java 8的Lambda表达式
- Lambda表达式借助于**invokedynamic指令**来实现
```java
int x = ..
IntStream.of(1, 2, 3).map(i -> i * 2).map(i -> i * x);
```
上述例子：在运行过程中，map接收一个IntUnaryOperator接口类型的参数，invokedynamic指令会将i -> i * 2和i -> i * x这两个Lambda表达式转化为IntUnaryOperator实例
- 尽量使用非捕获（即没有捕获其它变量，例如i -> i * 2为非捕获型的Lambda表达式，而i -> i * x因为捕获了变量x，因此为捕获型的Lambda表达式）的Lambda表达式











