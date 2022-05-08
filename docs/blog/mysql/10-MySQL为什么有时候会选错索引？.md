---
toc: true
title: 10-MySQL为什么有时候会选错索引?
date: 2022-5-8
tags: [MySQL实战45讲]
categories:
 - MySQL
---

编写SQL语句的时候，如果没有指定使用哪一个索引，那么会由MySQL的优化器来选择合适的索引。

explain命令可以查询出执行语句时选择的索引、表等信息。示例如下：
> explain select * from activity where activity_id=20000

show命令可以查看一张表中索引的相关信息。示例如下：
> show index from activity

索引选择异常如何处理？

- 采用force index手动选择一个索引

- 考虑修改SQL语句，引导MySQL使用我们期望的索引

- 新建一个索引或者删除掉误用的索引
