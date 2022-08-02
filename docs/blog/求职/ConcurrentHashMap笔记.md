---
toc: true
title: ConcurrentHashMap笔记
date: 2022-7-25
tags: [Java集合]
categories: 
- Collection
---


## JDK 1.8 ConcurrentHashMap的put方法源码

```java
    /** Implementation for put and putIfAbsent */
    final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f; int n, i, fh;
            if (tab == null || (n = tab.length) == 0)
                //初始化Node数组
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                //自旋CAS插入元素
                if (casTabAt(tab, i, null,
                             new Node<K,V>(hash, key, value, null)))
                    break;                   // no lock when adding to empty bin
            }
            else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
            else {
                V oldVal = null;
                synchronized (f) {
                    if (tabAt(tab, i) == f) {
                        if (fh >= 0) {
                            binCount = 1;
                            for (Node<K,V> e = f;; ++binCount) {
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node<K,V>(hash, key,
                                                              value, null);
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                    }
                }
                if (binCount != 0) {
                    //链表长度大于等于8会调用treeifyBin方法转化为红黑树
                    if (binCount >= TREEIFY_THRESHOLD)
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }
```

## ConcurrentHashMap的底层实现

以JDK1.8为例，下面从ConcurrentHashMap的整体架构、基本功能、性能优化方面进行说明（总）。首先是整体架构，ConcurrentHashMap底层数据结构采用的是Node数组+链表+红黑树。在进行初始化时，如果不显示指定大小，ConcurrentHashMap的默认初始容量大小为16。由于ConcurrentHashMap的核心依然是哈希表，因此也会存在Hash冲突。ConcurrentHashMap采用链式寻址的方式来解决哈希冲突。具体来说，当链表长度大于等于8时，如果数组长度小于64，那么会对数组进行扩容来解决冲突，如果数组长度大于等于64时会调用treeifyBin()方法把链表转化为红黑树；随着ConcurrentHashMap的动态扩容，**如果链表长度小于等于6，红黑树又会退化为链表**。然后是基本功能，ConcurrentHashMap的基本功能和HashMap类似，但在HashMap的基础上提供了并发安全的实现。最后是性能优化方面，主要体现在以下几点上：①在jdk 1.7中，concurrenthashmap采用分段锁技术对segment一段数据进行加锁，而在jdk1.8中，currenthashmap采用synchronized对一个node节点进行加锁，锁的粒度更加小。②jdk1.8中引入了红黑树，提高了查询性能，使得查询的时间复杂度降低到o(logn)。
