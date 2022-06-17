---
toc: true
title: 30-如何使用Redis实现分布式锁？
date: 2022-6-4
tags: [Redis核心技术与实战]
categories:
- Redis
---


Redis可以被多个客户端共享访问，相当于是一个**共享存储系统**，可以用来保存分布式锁。

## 单机上的锁和分布式锁的联系和区别

相同点：客户端加锁和释放锁的逻辑一样（可以创建一个锁变量lock，lock有两个值0（线程未持有锁）和1（线程持有锁），加锁时同样需要判断锁变量的值，根据锁变量值来判断能否加锁成功；释放锁时需要把锁变量值设置为 0，表明客户端不再持有锁。）

区别：分布式场景下，锁变量需要一个共享存储系统来维护。

实现分布式锁的两个要求：

> 要求一：分布式锁的加锁和释放锁的过程，涉及多个操作。所以，在实现分布式锁时，我们需要保证这些锁操作的原子性；
> 要求二：共享存储系统保存了锁变量，如果共享存储系统发生故障或宕机，那么客户端也就无法进行锁操作了。在实现分布式锁时，我们需要考虑保证共享存储系统的可靠性，进而保证锁的可靠性。

## 基于一个Redis实例实现分布式锁

下图展示了Redis中使用一个键值对来保存一个锁变量（键值对的key：lock_key是锁变量名，键值对的值是锁变量的值。）以及两个客户端（A和C）同时请求加锁的操作过程：

![极客-Redis核心技术与实战-2022-06-04-20-10-15](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/极客-Redis核心技术与实战-2022-06-04-20-10-15.png)

下图展示了客户端A释放锁的操作过程：

![极客-Redis核心技术与实战30节-2022-06-04-20-15-26](https://images-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/极客-Redis核心技术与实战30节-2022-06-04-20-15-26.png)

如何保证操作的原子性？

使用Redis提供的SET命令来保证加锁操作的原子性。
使用Lua脚本释放锁来保证原子性
伪代码如下：

```redis
// 加锁，$unique_value为不同客户端的唯一标识（防止A客户端加锁，B客户端释放了A客户端的锁，然后客户端C申请锁成功，导致A和C客户端没有互斥执行），$second为锁的过期时间（防止客户端发生异常无法释放锁）
SET $lock_key $unique_value EX $second NX
// 业务逻辑
DO THINGS
// 释放锁
redis-cli  --eval  unlock.script lock_key , unique_value 
```

unlock.script脚本（Lua脚本）伪代码：

```Lua
//释放锁 比较unique_value是否相等，避免误释放，KEYS[1]表示 lock_key，ARGV[1]是当前客户端的唯一标识
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

::: theorem SET命令介绍
Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful SET operation.

**Options:**
The SET command supports a set of options that modify its behavior:

EX seconds -- Set the specified expire time, in seconds.
PX milliseconds -- Set the specified expire time, in milliseconds.
EXAT timestamp-seconds -- Set the specified Unix time at which the key will expire, in seconds.
PXAT timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds.
NX -- Only set the key if it does not already exist.
XX -- Only set the key if it already exist.
KEEPTTL -- Retain the time to live associated with the key.
GET -- Return the old string stored at key, or nil if key did not exist. An error is returned and SET aborted if the value stored at key is not a string.
Note: Since the SET command options can replace SETNX, SETEX, PSETEX, GETSET, it is possible that in future versions of Redis these commands will be deprecated and finally removed.

**Return:**
Simple string reply: OK if SET was executed correctly.

Null reply: (nil) if the SET operation was not performed because the user specified the NX or XX option but the condition was not met.

If the command is issued with the GET option, the above does not apply. It will instead reply as follows, regardless if the SET was actually performed:

Bulk string reply: the old string value stored at key.

Null reply: (nil) if the key did not exist.

**Examples:**

```redis
redis:6379> SET mykey "Hello"
"OK"
redis:6379> GET mykey
"Hello"
redis:6379> SET anotherkey "will expire in a minute" EX 60
"OK"
```

::: right
来自 [Redis官网](https://redis.io/commands/setnx/)
:::


::: theorem DEL命令介绍
Removes the specified keys. A key is ignored if it does not exist.

Return
Integer reply: The number of keys that were removed.

Examples:

```redis
redis:6379> SET key1 "Hello"
"OK"
redis:6379> SET key2 "World"
"OK"
redis:6379> DEL key1 key2 key3
(integer) 2
```

::: right
来自 [Redis官网](https://redis.io/commands/setnx/)
:::

## 基于多个Redis实例实现分布式锁

> 为了避免 Redis 实例故障而导致的锁无法工作的问题，Redis 的开发者 Antirez 提出了分布式锁算法 Redlock。

Redlock算法的思路：

> 让客户端和多个独立的 Redis 实例依次请求加锁，如果客户端能够和半数以上的实例成功地完成加锁操作，那么我们就认为，客户端成功地获得分布式锁了，否则加锁失败。这样一来，即使有单个 Redis 实例发生故障，因为锁变量在其它实例上也有保存，所以，客户端仍然可以正常地进行锁操作，锁变量并不会丢失。

Redlock算法的执行步骤(假设有N个Redis实例)：

> 第一步是，客户端获取当前时间。

> 第二步是，客户端按顺序依次向 N 个 Redis 实例执行加锁操作。
> 这里的加锁操作和在单实例上执行的加锁操作一样，使用 SET 命令，带上 NX，EX/PX 选项，以及带上客户端的唯一标识。当然，如果某个 Redis 实例发生故障了，为了保证在这种情况下，Redlock 算法能够继续运行，我们需要给加锁操作设置一个超时时间。如果客户端在和一个 Redis 实例请求加锁时，一直到超时都没有成功，那么此时，客户端会和下一个 Redis 实例继续请求加锁。加锁操作的超时时间需要远远地小于锁的有效时间，一般也就是设置为几十毫秒。

> 第三步是，一旦客户端完成了和所有 Redis 实例的加锁操作，客户端就要计算整个加锁过程的总耗时。
> 客户端只有在满足下面的这两个条件时，才能认为是加锁成功。
> 条件一：客户端从超过半数（大于等于 N/2+1）的 Redis 实例上成功获取到了锁；
> 条件二：客户端获取锁的总耗时没有超过锁的有效时间。
> 在满足了这两个条件后，我们需要重新计算这把锁的有效时间，计算的结果是锁的最初有效时间减去客户端为获取锁的总耗时。如果锁的有效时间已经来不及完成共享数据的操作了，我们可以释放锁，以免出现还没完成数据操作，锁就过期了的情况。当然，如果客户端在和所有实例执行完加锁操作后，没能同时满足这两个条件，那么，客户端向所有 Redis 节点发起释放锁的操作。在 Redlock 算法中，释放锁的操作和在单实例上释放锁的操作一样，只要执行释放锁的 Lua 脚本就可以了。这样一来，只要 N 个 Redis 实例中的半数以上实例能正常工作，就能保证分布式锁的正常工作了。所以，在实际的业务应用中，如果你想要提升分布式锁的可靠性，就可以通过 Redlock 算法来实现。

