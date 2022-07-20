---
toc: true
title: 24-MySQL是怎么保证主备一致的？
date: 2022-7-3
tags: [MySQL实战45讲]
categories:
 - MySQL
---

MySQL主从备份依赖于binlog日志，binlog日志有三种不同的格式，即statement、row、mixed三种，不同格式的binlog在主从备份过程中可能会有那些区别呢？

## MySQL主从备份的基本原理


![24-MySQL是怎么保证主备一致的？-2022-07-03-10-57-03](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/24-MySQL是怎么保证主备一致的？-2022-07-03-10-57-03.png)

> 如上图所示，在状态 1 中，客户端的读写都直接访问节点 A，而节点 B 是 A 的备库，只是将 A 的更新都同步过来，到本地执行。这样可以保持节点 B 和 A 的数据是相同的。当需要切换的时候，就切成状态 2。这时候客户端读写访问的都是节点 B，而节点 A 是 B 的备库。


![主备流程图-2022-07-03-11-00-46](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/主备流程图-2022-07-03-11-00-46.png)


> 上图可以看到：主库接收到客户端的更新请求后，执行内部事务的更新逻辑，同时写 binlog。备库 B 跟主库 A 之间维持了一个长连接。主库 A 内部有一个线程，专门用于服务备库 B 的这个长连接。一个事务日志同步的完整过程是这样的：
> ①在备库 B 上通过 change master 命令，设置主库 A 的 IP、端口、用户名、密码，以及要从哪个位置开始请求 binlog，这个位置包含文件名和日志偏移量。
> ②在备库 B 上执行 start slave 命令，这时候备库会启动两个线程，就是图中的 io_thread 和 sql_thread。其中 io_thread 负责与主库建立连接。
> ③主库 A 校验完用户名、密码后，开始按照备库 B 传过来的位置，从本地读取 binlog，发给 B。
> ④备库 B 拿到 binlog 后，写到本地文件，称为中转日志（relay log）。
> ⑤sql_thread 读取中转日志，解析出日志里的命令，并执行。

## binlog三种日志格式

statement格式：空间开销小，但可能造成主从数据库数据不一致，例如某一条删除语句"
mysql> delete from t where a>=4 and t_modified<='2018-11-10' limit 1;"，主库执行时走的是索引a，而从库执行时走的是索引t_modified，可能导致删除的数据不是同一行。

row格式：恢复数据快，但空间开销很高

mixed格式：

> MySQL 自己会判断这条 SQL 语句是否可能引起主备不一致，如果有可能，就用 row 格式，否则就用 statement 格式。

现在MySQL的binlog格式多采用row和mixed格式


## 循环复制问题

![双M结构-2022-07-03-11-15-56](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/双M结构-2022-07-03-11-15-56.png)

在实际工作中，用得比较多的是如上图所示的双M结构的主从备份。节点 A 和 B 之间总是互为主备关系。这样在切换的时候就不用再修改主备关系。但是这种结构会引起一个问题，即循环复制：

> 业务逻辑在节点 A 上更新了一条语句，然后再把生成的 binlog 发给节点 B，节点 B 执行完这条更新语句后也会生成 binlog。（建议把参数 log_slave_updates 设置为 on，表示备库执行 relay log 后生成 binlog）。那么，如果节点 A 同时是节点 B 的备库，相当于又把节点 B 新生成的 binlog 拿过来执行了一次，然后节点 A 和 B 间，会不断地循环执行这个更新语句，也就是循环复制了。

如何解决循环复制的问题：

> ①规定两个库的 server id 必须不同，如果相同，则它们之间不能设定为主备关系；
> ②一个备库接到 binlog 并在重放的过程中，生成与原 binlog 的 server id 相同的新的 binlog；
>③ 每个库在收到从自己的主库发过来的日志后，先判断 server id，如果跟自己的相同，表示这个日志是自己生成的，就直接丢弃这个日志。