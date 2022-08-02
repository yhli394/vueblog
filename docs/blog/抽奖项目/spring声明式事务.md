---
toc: true
title: spring声明式事务
date: 2022-7-18
tags: [抽奖项目]
categories: 
- Project
sticky: 2
---

spring事务分为编程式事务和声明式事务，由于编程式事务和业务逻辑代码耦合度较高，因此，很少使用。本次只介绍spring中的声明式事务。

## 声明式事务

声明式事务是基于AOP实现的，在日常使用中，只需要在类或方法上添加一个@Transactional注解即可。@Transactional注解中有propagation、readOnly等属性，下面将对常用的属性进行介绍。

### propagation属性

propagation是事务的传播行为，它的出现是为了解决业务方法之间相互调用所产生的事务问题。事务传播行为一共有七种，分别是REQUIRED（默认的事务传播行为）、REQUIRES_NEW、SUPPORTS、NOT_SUPPORTED、MANDATORY、NEVER、NESTED。

以TestTransactionA和TestTransactionB这两个类，且方法A内部调用方法B为例来进行说明，下面是这两个类的信息：

TestTransactionA类

```java
@Service
public class TestTransactionA {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TestTransactionB testTransactionB;

    @Transactional
    public void A() throws Exception {
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100001);
        //C();
        testTransactionB.B();
        try {
            int i = 2/0;
        }catch (Exception e){
            //throw e;
        }
        throw new Exception("xxxx");
    }

    //@Transactional
    //public void C(){
    //    jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100002);
    //}

}
```

TestTransactionB类

```java
@Service
public class TestTransactionB {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void B(){
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100002);
        //int i = 2/0;
    }

}

```

- REQUIRED

@Transactional注解默认的propagation就是REQUIRED，如果方法A和方法B都开启了事务，执行方法A，控制台的日志会出现**Participating in existing transaction**，表明这两个方法是在同一个事务内。如果方法A未开启事务，方法B开启了事务，那么方法B内部会独立的开启一个自己的事务。

- REQUIRES_NEW 

如果方法A和B都开启了事务，且B的事务传播行为是REQUIRES_NEW，执行方法A，控制台日志会打印如下的日志：

```log
Creating new transaction with name [yhli.work.doalgorithmwithidea.spring.TestTransactionA.A]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT
......
Executing prepared SQL update
Executing prepared SQL statement [update activity set state = ? where activity_id=?;]
HikariPool-1 - Pool stats (total=1, active=1, idle=0, waiting=0)
Suspending current transaction, creating new transaction with name [yhli.work.doalgorithmwithidea.spring.TestTransactionB.B]
.....
Initiating transaction commit
Committing JDBC transaction on Connection [HikariProxyConnection@1138121345 wrapping com.mysql.cj.jdbc.ConnectionImpl@17ac550a]
Releasing JDBC Connection [HikariProxyConnection@1138121345 wrapping com.mysql.cj.jdbc.ConnectionImpl@17ac550a] after transaction
Resuming suspended transaction after completion of inner transaction
......
Committing JDBC transaction on Connection [HikariProxyConnection@998004967 wrapping com.mysql.cj.jdbc.ConnectionImpl@166c2c17]
```

也就是说方法A的事务执行后，会被挂起（进行等待，不会提交），此时会开启方法B的事务，待方法B事务提交后，会恢复挂起的事务，然后再进行提交。

如果方法A上没有事务，方法B上有事务，且事务传播行为是REQUIRES_NEW，执行方法A，方法A无事务执行，方法B会独立的开启一个事务。

- SUPPORTS

如果方法A有事务，方法B的事务传播行为是SUPPORTS，执行方法A，控制台会有日志**Participating in existing transaction**，表明A和B属于同一个事务。如果方法A无事务，方法B的事务传播行为是SUPPORTS，执行方法A，方法A和B都以非事务方式执行。

- NOT_SUPPORTED

如果方法A开启事务，方法B开启事务，且事务传播行为是NOT_SUPPORTED，执行方法A，A中的事务执行后会被挂起，等待方法B以非事务形式执行完才会被恢复。

- MANDATORY

如果方法A开启事务，方法B开启事务，且事务传播行为是MANDATORY，执行方法A，方法A和方法B属于同一个事务。

如果方法A未开启事务，方法B开启事务，且事务传播行为是MANDATORY，执行方法A，会报错： **No existing transaction found for transaction marked with propagation 'mandatory。**

- NEVER

如果方法A开启事务，方法B开启事务，且事务传播行为是NEVER，执行方法A，会报错：**Existing transaction found for transaction marked with propagation 'never。**

- NESTED

如果方法A开启事务，方法B开启事务，且事务传播行为是NESTED，执行方法A，
控制台会出现如下日志：

```log
Creating new transaction with name [yhli.work.doalgorithmwithidea.spring.TestTransactionA.A]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT
......
Creating nested transaction with name [yhli.work.doalgorithmwithidea.spring.TestTransactionB.B]
.....
Executing prepared SQL update
Executing prepared SQL statement [update activity set state = ? where activity_id=?;]
Releasing transaction savepoint
Executing prepared SQL update
Executing prepared SQL statement [update activity set state = ? where activity_id=?;]
......
Committing JDBC transaction on Connection [HikariProxyConnection@2035215096 wrapping com.mysql.cj.jdbc.ConnectionImpl@34d480b9]
```

意思是会在事务内部嵌套创建一个事务。如果主事务A发生回滚，那么子事务B也会跟着回滚。如果嵌套事务B发生异常被catch住会回滚，主事务A可以不回滚，具体代码如下：

```java
    @Transactional
    public void A(){
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100001);
        try {
            testTransactionB.B();
        }catch (Exception e){
        }
    }
    @Transactional(propagation = Propagation.NESTED)
    public void B(){
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100002);
        int i = 2/0;
    }
```

### rollbackFor属性

@Transactional注解中默认遇到RuntimeException和Error这两种非检查异常事务会进行回滚。

```java
    @Transactional
    public void A() throws Exception {
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100001);
        testTransactionB.B();
        throw new Exception("xxxx");
    }

```

上面的例子，方法A中显示的抛出Exception("xxxx")异常，执行方法A，事务不会回滚。如果想要方法A再遇到Exception异常进行回滚，可以使用rollbackFor属性进行指定，如下例子所示：

```java
    @Transactional(rollbackFor = Exception.class)
    public void A() throws Exception {
        jdbcTemplate.update("update activity set state = ? where activity_id=?;", 10, 100001);
        testTransactionB.B();
        throw new Exception("xxxx");
    }
```

### readOnly属性

readOnly属性默认为false，当设置为true，顾名思义，表明事务只可读。并发场景下，一个方法中一次需要执行多个SQL语句，第一个SQL语句执行完后，由于并发问题，字段A的数据被更改了，第二个SQL语句查询到的字段A的数据和第一个SQL查询到的字段A的数据不一致。为了避免这种情况的发生，可以使用 @Transactional(readOnly = true)让这些SQL在同一个事务中。

## 总结

- 同一个类中，方法之间相互调用会导致事务失效。假设，类C中有两个方法A和B，方法A调用方法B，方法B使用注解@Transactional开启事务，不论方法A是否开启事务，执行方法A，方法B的事务会失效，即spring不会在方法B内部创建新的事务。