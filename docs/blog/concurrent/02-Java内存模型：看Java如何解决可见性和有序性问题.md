---
toc: true
title: 02-Java内存模型：看Java如何解决可见性和有序性问题
date: 2022-1-24
tags: [《Java并发编程实战》]
categories: 
- Concurrent
---

#### 什么是Java内存模型？

- 解决可见性和有序性问题的合理方案是按需禁用缓存以及编译优化

- Java内存模型规范了JVM如何提供按需禁用缓存和编译优化的方法，这些方法包括volatile,synchronized和final三个关键字，以及六项Happends-Before规则
<!--more-->
#### Volatile

volatile关键字在C语言里面也有，最原始的意义就是**禁用CPU缓存**

CPU缓存和内存的关系类似redis和数据库的关系

```java
//在int前加上volatile关键字会告诉编译器，对x这个变量的读写不能使用CPU缓存，必须从内存中读取或者写入
volatile int x = 0;
```

线程A调用如下示例中的writer()方法，线程B调用reader()方法，线程B看到的x可能是0也可能是42（jdk版本低于1.5），而在jdk1.5以上的版本，线程B看到的x为42。导致出现这种现象的原因是x可能被CPU缓存。

```java
package com.li.leetcode;


class VolatileExample {
    int x = 0;//未被volatile关键字修饰
    volatile boolean v = false;
    
    public void writer() {
        x = 42;
        v = true;
    }
    public void reader() {
        if (v == true) {
            // 这里x会是多少呢？
        }
    }
}
```

#### Happens-Before规则

含义：**前面一个操作的结果对后续操作是可见的**

Happens-Before规则约束了编译器的优化行为，虽允许编译器优化，但是要求编译器优化后一定遵守Happens-Before规则

Happens-Before规则中和程序相关的规则有以下六项：

##### 1.程序的顺序性规则

含义:指的是在一个线程中，按照程序执行的顺序，前面的操作Happens-Before于后续的任意操作

例如，下面writer()方法中的代码，可以说x=42;Happens-Before于v=true;

```java
package com.li.leetcode;


class VolatileExample {
    int x = 0;//未被volatile关键字修饰
    volatile boolean v = false;
    
    public void writer() {
        x = 42;
        v = true;
    }
    public void reader() {
        if (v == true) {
            // 这里x会是多少呢？
        }
    }
}
```

##### 2.volatile变量规则

含义：指对一个volatile变量的写操作，Happens-Before于后续对这个volatile变量的读操作

##### 3.传递性

含义：指的是如果A Happens-Before B，且B Happens-Before C，那么A Happens-Before C

![image-20220124205758749](https://raw.githubusercontent.com/yhli394/images/main/blog_image/java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/02/image-20220124205758749.png)

上图中:

(a)x=42;Happens-Before于写变量v=true;

(b)写变量v=true;Happens-Before于读变量v=true;

通过a,b可以推出：x=42;Happens-Before于读变量v=true;即，线程A设置的x=42对于线程B读取变量v=true时是可见的。

##### 4.管程中锁的规则

含义：指的是对一个锁的解锁Happens-Before于后续对这个锁的加锁

> **管程** (英语：Monitors）是一种程序结构，结构内的多个子程序（[对象](https://zh.wikipedia.org/wiki/对象_(计算机科学))或[模块](https://zh.wikipedia.org/wiki/模組_(程式設計))）形成的多个[工作线程](https://zh.wikipedia.org/wiki/工作_(資訊科學))互斥访问共享资源。--维基百科

管程是一种通用的同步原语，在Java中的synchronized就是对管程的实现

管程中的锁在Java里面是隐式实现的，加锁和释放锁都是编译器帮助我们实现的

示例代码：

```java
synchronized (this) { //此处自动加锁
  // x是共享变量,初始值=10
  if (this.x < 12) {
    this.x = 12; 
  }  
} //此处自动解锁
```

对上面代码的理解：

（1）假设线程A先执行上面的代码，有x=12Happens-Before于释放锁

（2）线程B又执行上面的代码，有释放锁（解锁）Happens-Before于线程B获得锁（加锁）

根据传递性：x=12;Happens-Before于线程B获得锁（加锁），即线程B可以看到x==12

##### 5.线程start()规则

含义：指的是主线程A启动子线程B后，子线程B可以看到主线程A在启动子线程B前的操作

##### 6.线程join()原则

含义：主线程A等待子线程B完成（主线程A通过调用子线程B的join()方法实现），当子线程B完成后（主线程A中join()方法返回），主线程A能够看到（看到：指的是对共享变量的操作）子线程B的操作

#### Final关键字

final修饰变量时，会告诉编译器这个变量生而不变





















