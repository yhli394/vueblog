---
toc: true
title: 16-order by是怎么工作的？
date: 2022-5-29
tags: [MySQL实战45讲]
categories:
 - MySQL
---

## 怎样知道一个select查询语句是否做了全表扫描？

::: theorem MySQL Explain命令

MySQL提供了explain命令，通过在Select语句前面加上explain命令可以知道MySQL是如何执行命令的。例如：

```mysql
explain select activity_name,activity_id,id from user_take_activity where activity_name='活动名';
```

执行上面的语句后通过查看type字段，如果type字段的值为ALL，那么说明进行了全表扫描。后续如果需要对查询语句进行优化（添加索引等），可以结合explain命令来查看优化结果。

关于explain命令的说明可以查看官方文档

::: right
来自 [MySQL8.0官方文档](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#explain-extra-information)
:::

## 全字段排序

有如下一个SQL语句，它的执行流程是什么样的？

> select city,name,age from t where city='杭州' order by name limit 1000;
> 表部分信息：
CREATE TABLE `t` (
  `id` int(11) NOT NULL,
  `city` varchar(16) NOT NULL,
  `name` varchar(16) NOT NULL,
  `age` int(11) NOT NULL,
  `addr` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `city` (`city`)
) ENGINE=InnoDB;

> explain命令用在select语句上后得到的表中有一个Extra字段，Extra 这个字段中的“Using filesort”表示的就是需要排序，MySQL 会给每个线程分配一块内存用于排序，称为 sort_buffer。

上面的SQL语句执行流程：
![16-2022-05-29-11-04-49](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/16-2022-05-29-11-04-49.png)

## rowid排序

> max_length_for_sort_data，是 MySQL 中专门控制用于排序的行数据的长度的一个参数。它的意思是，如果单行的长度超过这个值，MySQL 就认为单行太大，要换一个算法。新的算法放入 sort_buffer 的字段，只有要排序的列（即 name 字段）和主键 id。但这时，排序的结果就因为少了 city 和 age 字段的值，不能直接返回了，整个执行流程就变成如下所示的样子：

![mysql45-16-2022-05-29-11-08-58](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/mysql45-16-2022-05-29-11-08-58.png)

> rowid 排序多访问了一次表 t 的主键索引，就是步骤 7。

## 全字段排序 VS rowid排序

> 如果 MySQL 实在是担心排序内存太小，会影响排序效率，才会采用 rowid 排序算法，这样排序过程中一次可以排序更多行，但是需要再回到原表去取数据。如果 MySQL 认为内存足够大，会优先选择全字段排序，把需要的字段都放到 sort_buffer 中，这样排序后就会直接从内存里面返回查询结果了，不用再回到原表去取数据。这也就体现了 MySQL 的一个设计思想：如果内存够，就要多利用内存，尽量减少磁盘访问。对于 InnoDB 表来说，rowid 排序会要求回表多造成磁盘读，因此不会被优先选择。

> 其实，并不是所有的 order by 语句，都需要排序操作的。从上面分析的执行过程，我们可以看到，MySQL 之所以需要生成临时表，并且在临时表上做排序操作，其原因是原来的数据都是无序的。如果能够保证从 city 这个索引上取出来的行，天然就是按照 name 递增排序的话，就可以不用再排序了。
