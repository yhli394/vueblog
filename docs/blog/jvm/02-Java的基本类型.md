---
toc: true
title: 02-Java的基本类型
date: 2022-1-13
tags: [《深入拆解Java虚拟机》]
categories:
- JVM
---

#### 基本概念

- #### asmtools.jar：可以用来修改.class文件(字节码文件)

- AsmTools 由一组（Java 类文件）汇编器/反汇编器组成，用于修改java字节码文件

- Jasm/Jdis:**一种汇编语言**，提供类似于 Java 的成员签名声明，同时为字节码指令提供符合 Java VM 规范的助记符。Jasm 还为类文件属性中常见的构造提供高级语法。Jasm 编码的测试对于以 Javac 编译的代码通常不会对字节码进行排序的方式对字节码进行排序很有用。

- JCod/JDec:一种提供类文件结构的字节码容器的**汇编语言**。JCod 编码测试可用于测试类文件的格式良好，以及在类文件结构中创建可能受普通 Java 编译器大小限制的集合。JCod 也可以用于以尊重类文件结构的有条不紊的方式对类文件进行“模糊测试”。

<!--more-->

#### 01节-《Java代码是怎么运行的？》作业回顾

##### 遇到的问题

1. 如果要编译的源文件（目录：D:\text\src\main\java\com\example\hello\Foo.java）中最上方有包名，如下：

![20220113203623067.png](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113203623067.png)

2. 使用命令行在Foo.java所在的当前目录进行编译后，执行java Foo会报错，如下：

![20220113204127001.png](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113204127001.png)

3. 解决方法
   
（1）解决方法1：将代码最上面的包名注释掉

![image-20220113204309994.png](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113204309994.png)

（2）解决方法2：不删除包名，在当前目录下创建一个包目录，即D:\text\src\main\java\com\example\hello\com\example\hello

![image-20220113205134573](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113205134573.png)

​（3）解决方法3：不删除包名，在D:\text\src\main\java目录下执行命令

![image-20220113205540816](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113205540816.png)

（1）源代码

```java
public class Foo {
    public static void main(String[] args) {
        boolean flag = true;
        if (flag) System.out.println("Hello, Java!");
        if (flag == true) System.out.println("Hello, JVM!");
    }
}
```

（2）VsCode连接远程linux云服务器，bash窗口使用javac Foo.java命令将Foo.java编译成Foo.class

（3）使用java Foo命令运行Foo.class文件，输出如下：

```java
Hello, Java!
Hello, JVM!
```

（4）使用java -jar asmtools.jar jdis Foo.class>Foo.jasm命令将Foo.class文件的内容转码并输出到Foo.jasm文件中，Foo.jasm文件内容如下：

```java

super public class Foo
	version 52:0
{


public Method "<init>":"()V"
	stack 1 locals 1
{
		aload_0;
		invokespecial	Method java/lang/Object."<init>":"()V";
		return;
}

public static Method main:"([Ljava/lang/String;)V"
	stack 2 locals 2
{
		iconst_1;
		istore_1;
		iload_1;
		ifeq	L14;
		getstatic	Field java/lang/System.out:"Ljava/io/PrintStream;";
		ldc	String "Hello, Java!";
		invokevirtual	Method java/io/PrintStream.println:"(Ljava/lang/String;)V";
	L14:	stack_frame_type append;
		locals_map int;
		iload_1;
		iconst_1;
		if_icmpne	L27;
		getstatic	Field java/lang/System.out:"Ljava/io/PrintStream;";
		ldc	String "Hello, JVM!";
		invokevirtual	Method java/io/PrintStream.println:"(Ljava/lang/String;)V";
	L27:	stack_frame_type same;
		return;
}

} // end Class Foo

```

（5）将iconst_1改为iconst_2

（6）java -jar asmtools.jar jasm Foo.jasm命令将重新生成Foo.class文件

（7）运行java Foo，输出如下：

```java
Hello, Java!
```

- java引入8个基本类型的原因：基本类型更贴近计算机硬件底层的数据结构，不需要进行包装和转换，能够在执行效率和内存使用两方面提升软件性能

#### Java虚拟机的boolean类型

- 虚拟机中boolean将被映射成int类型，具体的，true映射为1，false映射为0

#### Java的基本类型

- 共有8种基本类型，其中包括4种整型、2种浮点类型、1种字符类型、1种布尔类型

![image-20220113191051790](https://raw.githubusercontent.com/yhli394/images/main/blog_image/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3java%E8%99%9A%E6%8B%9F%E6%9C%BA/02/image-20220113191051790.png)

- byte、short、int、long、float、double值域依次扩大，值域大的类型不可以赋值给值域小的类型，例如

```java
int a =10;
double b = a;
int x = b;//报错，因为int类型比double类型小，因此需要进行强转，即int x = (int)b;
```

#### Java基本类型的大小

- Java虚拟机每调用一个方法就会创建一个栈帧
- 栈帧主要由局部变量区（包含局部变量、实例方法的this指针、方法所接收的参数）和字节码的操作数栈两部分组成

- Java虚拟机规范中，局部变量区等价于一个数组，并且可以用正整数来索引

- HotSpot中，boolean字段占一字节，而boolean数组则直接用byte数组来实现
- 为保证堆中boolean值是合法的，HotSpot在存储时显示地进行了**掩码操作**，即只会**取最后一位的值**存入boolean字段或数组中，以本章节例题为例说明：

(1)执行javac Foo.java命令，Foo.java源文件如下：

```
//package com.example.hello;

/**
 * @author yhli3
 * @classname Foo
 * @Date 2022/1/12 19:16
 */
public class Foo {
    static boolean boolValue;
    public static void main(String[] args) {
        boolValue = true;
        if (boolValue) System.out.println("Hello, Java!");
        if (boolValue == true) System.out.println("Hello, JVM!");
    }
}
```

(2)执行java Foo，输出如下

```java
Hello, Java!
Hello, JVM!
```

(3)执行java -jar asmtools.jar jdis Foo.class>Foo.jasm，并将boolValue的值改为2，即将iconst_1改为iconst_2
(4)执行java -jar asmtools.jar jasm Foo.jasm

(5)执行java Foo，输出如下：

```java
无输出
```

(6)回到第三步，将将boolValue的值改为3，即将iconst_1改为iconst_3

(7))执行java -jar asmtools.jar jasm Foo.jasm

(8)执行java Foo，输出如下：

```java
Hello, Java!
Hello, JVM!
```

(9)分析

- 十进制的2等价于二进制的10，虚拟机进行掩码操作，只取最后一位0存入boolean字段或者数组

- 十进制的3等价于二进制的11，虚拟机进行掩码操作，只取最后一位1存入boolean字段或者数组



















