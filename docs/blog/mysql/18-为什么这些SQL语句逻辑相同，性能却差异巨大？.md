---
toc: true
title: 18-为什么这些SQL语句逻辑相同，性能却差异巨大？
date: 2022-6-17
tags: [MySQL实战45讲]
categories:
 - MySQL
---

作者举了三个例子：

第一个例子的SQL语句如下，查询的是tradelog表的所有年份中7月份的交易记录总数

```mysql
mysql> select count(*) from tradelog where month(t_modified)=7;
```

第二个例子的SQL语句如下，查询tradelog表中满足tradeid条件的数据，其中tradeid是varchar(32)类型

```mysql
mysql> select * from tradelog where tradeid=110717;
上面的语句等价于如下的句子：
mysql> select * from tradelog where  CAST(tradid AS signed int) = 110717;
```

第三个例子的SQL语句如下，查询 id=2 的交易的所有操作步骤信息，其中tradelog表默认字符集为utf8mb4，而trade_detail表默认字符集为utf8

```mysql
mysql> select d.* from tradelog l, trade_detail d where d.tradeid=l.tradeid and l.id=2; 
```

三个例子说明一个问题：对索引字段做函数操作，可能会破坏索引值的有序性，优化器会放弃走索引树搜索功能，选择进行全表扫描。

