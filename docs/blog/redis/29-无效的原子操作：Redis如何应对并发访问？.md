---
toc: true
title: 29-无效的原子操作：Redis如何应对并发访问？
date: 2022-6-4
tags: [Redis核心技术与实战]
categories:
- Redis
---

## Redis如何应对并发访问？

Redis中提供了加锁和原子操作应对并发访问。

- 加锁

> 加锁是一种常用的方法，在读取数据前，客户端需要先获得锁，否则就无法进行操作。当一个客户端获得锁后，就会一直持有这把锁，直到客户端完成数据更新，才释放这把锁。

加锁存在的问题：

1. 如果并发量很大，当一个线程拿到锁之后，其它诸多线程会一直进入等待状态，直到锁释放，这降低了系统的并发访问性能。
2. 加锁需要用到分布式锁，分布式锁实现复杂，需要用额外的存储系统来提供加锁和解锁的操作。

- 原子操作

> 原子操作是指执行过程保持原子性的操作，而且原子操作执行时并不需要再加锁，实现了无锁操作。这样一来，既能保证并发控制，还能减少对系统并发性能的影响。

## Redis的两种原子操作方法

### 单命令操作

> 把多个操作在 Redis 中实现成一个操作，也就是单命令操作；

> Redis 是使用单线程来串行处理客户端的请求操作命令的，所以，当 Redis 执行某个命令操作时，其他命令是无法执行的，这相当于命令操作是互斥执行的。当然，Redis 的快照生成、AOF 重写这些操作，可以使用后台线程或者是子进程执行，也就是和主线程的操作并行执行。不过，这些操作只是读取数据，不会修改数据，所以，我们并不需要对它们做并发控制。

> INCR/DECR 命令可以对数据进行增值 / 减值操作，而且它们本身就是单个命令操作，Redis 在执行它们时，本身就具有互斥性。

::: theorem INCR命令和DECR命令
INCR命令：
Increments the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer. This operation is limited to 64 bit signed integers.

Examples
redis:6379> SET mykey "10"
"OK"
redis:6379> INCR mykey
(integer) 11
redis:6379> GET mykey
"11"
redis:6379> 

DECR命令：
Decrements the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer. This operation is limited to 64 bit signed integers.

Examples
redis:6379> SET mykey "10"
"OK"
redis:6379> DECR mykey
(integer) 9
redis:6379> SET mykey "234293482390480948029348230948"
"OK"
redis:6379> DECR mykey
(error) value is not an integer or out of range
redis:6379> 

::: right
来自 [Redis官网](https://redis.io/commands/decr/)
:::

如果多个操作只是单纯的对数据进行增加或减少值，Redsi提供的INCR和DECR命令可以直接帮助我们进行并发控制。如果多个操作不只是单纯的进行数据增减值，还包括更复杂的逻辑判断，此时Redis的单命令操作无法保证多个操作互斥执行，那么就需要用到Lua脚本来解决这个问题。

### Lua脚本

::: theorem Lua脚本简介
Lua（发音： /ˈluːə/，葡萄牙语“月亮”）是一个简洁、轻量、可扩展的脚本语言。Lua有着相对简单的C API而很容易嵌入应用中。很多应用程序使用Lua作为自己的嵌入式脚本语言，以此来实现可配置性、可扩展性。
::: right
来自 [维基百科](https://zh.wikipedia.org/zh-cn/Lua)
:::

> Redis 会把整个 Lua 脚本作为一个整体执行，在执行的过程中不会被其他命令打断，从而保证了 Lua 脚本中操作的原子性。如果我们有多个操作要执行，但是又无法用 INCR/DECR 这种命令操作来实现，就可以把这些要执行的操作编写到一个 Lua 脚本中。然后，我们可以使用 Redis 的 EVAL 命令来执行脚本。这样一来，这些操作在执行时就具有了互斥性。

## 小结

并发访问控制的本质是让多个客户端对临界区的代码互斥执行。