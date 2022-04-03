---
toc: true
title: 01-Java代码是怎样运行的？
date: 2022-1-3
tags: [《深入拆解Java虚拟机》]
categories:
- JVM
---

#### 基本概念

- JDK(Java Development Kit):Java开发工具包，不仅包含JRE，还包含javac（java编译器，把后缀名为.java的源代码编译为.class字节码文件）、java(运行工具，运行.class文件)、jar(打包工具)等开发组件
- JRE(Java Runtime Environment):Java运行时环境，主要由java虚拟机（JVM）和一些核心类库组成。
- applet：在网页中运行的Java程序被称为applet

<!--more-->

- 解释执行：逐条的将字节码翻译成机器码并执行（优点是无需等待编译的时间）
- 即时编译（Just-In-Time compilationm，JIT）：将一个方法中包含的所有字节码编译成机器码后再执行（优点是运行速度快）
- 热点代码：当虚拟机发现某个方法或者代码块运行特别频繁，就会把这些代码认定为“热点代码”（Hot Spot Code）

#### 为什么需要JVM

- Java是一门高级程序语言，语法非常复杂，抽象程度很高，直接在硬件上运行不太现实，因此需要java虚拟机进行适当的转换。

- Java虚拟机所能识别的指令序列称之为“Java字节码”，后缀名为.class的文件就是Java虚拟机可识别的字节码文件

- 虚拟机的优点：
  - 跨平台，节约了在硬件适配上的开销
  - 提供托管环境（Managed Runtime）：包括自动内存管理、垃圾回收等

#### JVM怎样运行字节码（以HotSpot为例）

（1）首先，将编译好的后缀名为.class的文件加载到虚拟机中的方法区（Method Area）

![img](https://static001.geekbang.org/resource/image/ab/77/ab5c3523af08e0bf2f689c1d6033ef77.png)

（2）虚拟机将.class文件（字节码文件）翻译（HotSpot采用混合翻译的形式，即解释执行和即时编译）成cpu所能理解的代码，即机器码

![img](https://static001.geekbang.org/resource/image/5e/3b/5ee351091464de78eed75438b6f9183b.png)

#### JVM的执行效率

- 对于不常用的代码，不需要花时间将其编译成机器码，而是采取解释执行的方式运行

- 理论上，即时编译后的java程序的执行效率可能会超过静态编译的C++程序，因为与静态编译相比，即时编译拥有程序的运行时信息，并且能够根据这个信息做出相应的优化，例如对于虚方法的调用。
- HotSpot内置了C1、C2、Graal三个即时编译器
  - Graal:java10正式引入
  - C1：Client编译器
  - C2：Server编译器
- Java7开始，HotSpot默认采用分层编译的方式，热点方法首先会被C1编译，然后热点方法中的热点会进一步被C2编译







