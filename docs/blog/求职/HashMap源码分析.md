---
toc: true
title: HashMap源码分析
date: 2022-7-22
tags: [Java集合]
categories: 
- Collection
---

## JDK1.7和1.8中HashMap的put方法

JDK1.7中put方法的源码：

```java
 public V put(K key, V value) {
        if (table == EMPTY_TABLE) {
            inflateTable(threshold);//初始化hash表大小为16
        }
        if (key == null)
            return putForNullKey(value);
        int hash = hash(key);
        int i = indexFor(hash, table.length);//计算数组下标
        for (Entry<K,V> e = table[i]; e != null; e = e.next) {
            Object k;
            //key相同就进行覆盖
            if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
                V oldValue = e.value;
                e.value = value;
                e.recordAccess(this);
                return oldValue;
            }
        }

        modCount++;
        addEntry(hash, key, value, i);
        return null;
    }
```

JDK1.8中put方法的源码：

```java
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }

    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
```

JDK 1.7中，HashMap的底层采用的数据结构是数组＋链表。数组中的每一个元素相当于一个链表，如果发生哈希冲突，首先会判断两个冲突节点的key是否一样，如果一样，那就把之前的key覆盖掉，如果两个冲突的节点key不一样，那么就会进入addEntry()方法，方法中首先会判断hash表中的元素个数size是否超过了threshold阈值（初始容量×加载因子（默认0.75）），如果超过了就会对哈希表进行扩容来解决冲突，否则就会通过头插法的方式将元素插入到链表中来解决冲突。

JDK 1.8中HashMap的底层采用的数据结构是数组+链表+红黑树。如果发生哈希冲突，首先会判断新加入节点和数组冲突位置上头节点的key、hash值是否一样，如果一样，那么就进行覆盖，否则会进行第二轮比较，如果头节点的类型已经是红黑树节点，那么会通过红黑树的变色和左右旋转来解决冲突，否则会通过尾插法将新节点插入到链表的尾部，然后会进行判断，如果链表的长度大于阈值8，然后会进入treeifyBin()方法，判断数组的长度如果小于64，会对数组进行扩容来解决冲突，如果数组的长度大于等于64那么会将链表变为红黑树来解决冲突。

## 为什么hashmap的长度是2的幂次方？

主要是为了hashmap变得更加高效，在hashmap中计算元素在数组中的索引不能使用hash值，因为hash值的取值范围在[-2^31,2^31-1]，长度有大约40亿，因此需要进行取模操作，研究发现如果整数n是2的幂次方，那么n-1和hash值进行与运算((n-1)&hash)等价于哈希表的长度对2取模(n%2)。位运算相对于取模操作更加高效。

## HashMap的resize()方法

JDK 1.8中HashMap的resize()方法源码：

```java
    /**
     * Initializes or doubles table size.  If null, allocates in
     * accord with initial capacity target held in field threshold.
     * Otherwise, because we are using power-of-two expansion, the
     * elements from each bin must either stay at same index, or move
     * with a power of two offset in the new table.
     *
     * @return the table
     */
    final Node<K,V>[] resize() {
        Node<K,V>[] oldTab = table;
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        int oldThr = threshold;
        int newCap, newThr = 0;
        if (oldCap > 0) {
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                     oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1; // double threshold
        }
        else if (oldThr > 0) // initial capacity was placed in threshold
            newCap = oldThr;
        else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        if (newThr == 0) {
            float ft = (float)newCap * loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE);
        }
        threshold = newThr;
        @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;
        if (oldTab != null) {
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    if (e.next == null)
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }

```

HashMap中扩容使用的是resize()方法，以下三种情况会进行扩容：①在将首个元素放入HashMap时；②遇到hash冲突，且链表长度大于8，数组大小小于64时；③没有hash冲突，但元素总个数超过threshold阈值；这三种情况下都会触发resize()方法。扩容的基本原理：当把首个元素放进HashMap，会进行首次扩容，初始化HashMap的容量为16，加载因子为0.75。否则，如果原数组大小超过了最大容量MAX_CAPACITY，那么不会增加数组的长度，而是把threshold阈值设置为Integer.MAX_VALUE。如果数组大小没有超过最大容量，那么会把数组容量扩大一倍。扩容之后，会遍历原数组，重新计算元素的索引，把元素存入新数组，非常耗时间。