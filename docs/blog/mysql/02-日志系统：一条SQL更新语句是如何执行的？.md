---
toc: true
title: 02|日志系统：一条SQL更新语句是如何执行的？
date: 2022-3-11
tags: [MySQL实战45讲]
categories:
 - MySQL
---

​ SQL更新语句和SQL查询语句都会经过连接器、分析器、优化器、执行器等模块，不同的是SQL更新语句在执行过程中还涉及到MySQL中的两个重要日志模块：redo log（重做日志）和binlog（归档日志）。

WAL技术（Write-Ahead Logging）：先写日志，再写磁盘。

## redo log

1. 当某一条SQL语句需要更新的时候，InnoDB引擎会先将更新的记录存储到redo log里面，并更新内存。另外，InnoDB存储引擎往往会在系统空闲的时候才将更新的记录写到磁盘中去。
2. InnoDB的redo log存储空间有限，下图显示了一个能够存储4GB空间的redo log，如果日志满了会删除以前的日志。

![一条SQL更新语句是如何执行的？-2022-03-13-16-07-58](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/一条SQL更新语句是如何执行的？-2022-03-13-16-07-58.png)

3. 上图，write pos(当前redo log日志写的位置)和checkpoint（需要删除日志的位置）之间表示的是日志的剩余空间，如果write pos追上check point，此时需要释放掉以前日志的部分空间，才能继续记录日志。
   
4. InnoDB因为有redo log，所以可以保证数据库发生异常重启后，之前的提交记录不会丢失，这个能力称之为**crash-safe**。

## binlog

  binlog（binary log）记录了对MySQL数据库执行更改的所有操作，但是不包括select、show这类的操作。

## binlog和redo log的区别

1. binlog（binary log）是MySQL的Server层实现的，所有引擎都可以使用；而redo log是InnoDB引擎特有的。
2. redo log是物理日志，记录的是“在某个数据页（数据页存放的是表中行的实际数据）上做了什么修改”；binlog是逻辑日志，记录的是这个语句的原始逻辑，比如“给ID=2这一行的c字段加1”。
3. redo log是循环写的，存储空间有限；binlog是可以追加写入的。“追加写”是指binlog文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。

## 两阶段提交

redo log的写入分成了prepare阶段和commit阶段，即两阶段提交。两阶段提交的目的是为了保证redo log和binlog两份日志之间的逻辑一致。
