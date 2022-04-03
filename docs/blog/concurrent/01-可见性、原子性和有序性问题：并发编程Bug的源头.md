---
toc: true
title: 01-可见性、原子性和有序性问题：并发编程Bug的源头
date: 2022-1-21
tags: [《Java并发编程实战》]
categories: 
- Concurrent
---

#### 术语

进程：执行中或进行中的程序，例如打开一个word或打开一个ppt称为一个进程。

线程：进程=资源+指令执行序列，在一个进程内部，**切换不同指令执行序列的程序**称为**线程**。

<!--more-->

#### 缓存导致的可见性问题

可见性：一个线程对共享变量的修改，另外一个线程能够立刻看到

单核时代，所有的线程都是在一颗CPU上执行，CPU缓存与内存的数据一致性容易解决，例如，下图，线程A对变量V的值进行更新，下一次线程B访问变量V，得到的是V的最新值

![image-20220122112440430](C:\Users\Swjtu-Li\AppData\Roaming\Typora\typora-user-images\image-20220122112440430.png)

多核时代，每颗CPU都有自己的缓存，CPU缓存与内存的数据一致性不是很容易解决，例如下图，线程A对变量V的操作对于线程B而言不具备可见性

![image-20220122112731161](C:\Users\Swjtu-Li\AppData\Roaming\Typora\typora-user-images\image-20220122112731161.png)

main方法中调用clac()方法，打印出的count的值是在10000-20000之间的随机数，count的值一般接近于20000，因为两个线程启动有时差；如果把循环次数改为1亿次，那么count的值一般接近1亿，此时可以忽略两个线程启动的时差，把两个线程看作是同时启动的；

```java
package com.li.leetcode;

public class Test {
    private static long count = 0;
    private void add10K() {
        int idx = 0;
        while(idx++ < 10000) {
            count += 1;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println(calc());//count为在10000-20000之间的随机数
    }

    public static long calc() throws InterruptedException {
        final Test test = new Test();
        // 创建两个线程，执行add()操作
        Thread th1 = new Thread(()->{
            test.add10K();
        });
        Thread th2 = new Thread(()->{
            test.add10K();
        });
        // 启动两个线程
        th1.start();
        th2.start();
        // 等待两个线程执行结束
        th1.join();
        th2.join();
        return count;
    }

}
```

#### 线程切换带来的原子性问题

- 时间片：例如，操作系统允许一个进程执行50ms，过了50ms进行任务切换，这50ms称为一个“时间片”

- 早期操作系统是基于进程来调度CPU，不同进程之间是不共享内存空间的
- 一个进程创建的所有线程共享一个内存空间，任务切换成本低，现代操作系统基于线程来调度CPU

- 高级语言里一条语句往往需要多条CPU指令完成，例如count=count+1，至少需要3条CPU指令：
  - 指令1：将变量count从内存加载到CPU的寄存器
  - 指令2：在寄存器中执行+1操作
  - 指令3：将结果写入内存（缓存机制导致可能写入的是CPU缓存而不是内存）

- 系统做任务切换，可以发生在任何一条CPU指令执行完，而不是语言中的一条语句执行完
- 线程切换可以发生在count=count+1前，也可以发生在count=count+1后，但不会发生在count=count+1的中间

- 原子性：一个或多个操作在CPU执行过程中不被中断的特性称为原子性

#### 编译优化带来的有序性问题

```java
package com.li.leetcode;

public class Singleton {
    static Singleton instance;

    /**
     * 双重检查创建单例对象
     * @return
     */
    static Singleton getInstance(){
        if (instance == null) {
            synchronized(Singleton.class) {
                if (instance == null){
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

上述代码中new Singleton()中的new操作理论上应该是：

（1）分配一块内存M

（2）在内存M上初始化Singleton对象

（3）然后将M的地址赋值给instance变量

实际编译优化后的顺序可能是：

（1）分配一块内存M

（2）然后将M的地址赋值给instance变量

（3）最后在内存M上初始化Singleton对象

现在有两个线程A和B，如果线程A执行完指令2后，线程切换到了线程B上，线程B执行getInstance()方法，此时instance!=null，返回未初始化的instance，可能触发空指针异常。

#### 参考文献

《Java并发编程实战》-王宝令

