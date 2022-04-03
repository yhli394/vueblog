---
toc: true
title: SpringBoot中的日志配置
date: 2022-2-13
tags: [SpringBoot]
categories:  
- Spring
---

#### 基本概念

日志（log），是对系统行为的一个记录，有利于开发人员在项目部署后通过查看系统的日志来快速定位Bug。
日志系统（log system）：主要负责对分散的日志（没日志系统前，日志可能分布在多台服务器上）进行集中管理，便于查阅和维护。
日志系统的工作流程：从服务器采集日志→处理日志数据→日志存储→日志可视化展示
门面模式（facade pattern）：一种设计模式，“指提供一个统一的接口去访问多个子系统的多个不同的接口，它为子系统中的一组接口提供一个统一的高层接口，使得子系统更容易使用”。
日志门面（Logging Facade）：为日志框架提供一套统一的API接口，常见的日志门面有SLF4J(Simple Logging Facade for Java),JCL(Jakarta Commons Logging)。
日志实现：日志门面的具体实现，例如Logback,Log4j,Log4j2,JUL(java.util.logging)
一般而言，配置日志会先选一种日志门面，然后选一种日志框架（例如Logback,Log4j）等。
日志级别：trace(优先级最低)→debug→info→warn→error(优先级最高)。
<!--more-->
#### Elastic Stack

>  “ELK”是三个开源项目的首字母缩写，这三个项目分别是：Elasticsearch、Logstash 和 Kibana。**Elasticsearch** 是一个**搜索和分析引擎**。**Logstash** 是**服务器端数据处理管道**，能够同时从多个来源采集数据，转换数据，然后将数据发送到诸如 Elasticsearch 等“存储库”中。**Kibana** 则可以让用户在 Elasticsearch 中使用图形和图表**对数据进行可视化**--https://www.elastic.co/cn/what-is/elk-stack

ELK是一个知名且开源的日志系统解决方案，由于引入了"一系列轻量型的单一功能数据采集器，并把它们叫做 Beats"，更名为ELK Stack(即Elastic Stack)

#### SpringBoot中配置SLF4J和Logback

1. 由于spring-boot-start-web依赖已经包含logback和slf4j所需的依赖，因此无需导入其它jar包

2. resources目录下创建logback.xml配置文件，文件内容如下：

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!--日志配置-->
<configuration>
    <!--设置日志文件的保存地址为logs文件夹下，通过${logPath}可以拿到logPath对应的value，即./logs-->
    <property name="logPath" value="./logs"/>

    <!--appender中的class属性可以指定日志向控制台，普通文件或滚动文件输出-->
    <!--向控制台输出日志-->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d [%thread] %-5level %logger{50} -[%file:%line]- %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!--滚动文件日志-->
    <appender name="rollFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--滚动策略，按照时间滚动-TimeBasedRollingPolicy-->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--每天生成一个日志文件-->
            <fileNamePattern>${logPath}/%d{yyyy-MM-dd}.log</fileNamePattern>
            <!--保留最近180天的日志-->
            <maxHistory>180</maxHistory>
            <!--用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志-->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <!--日志输出格式-->
            <pattern>%d [%thread] %-5level -[%file:%line]- %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!--name:指定需要打印日志的某一个包或者具体的某一个类-->
    <!--level：设置日志输出级别-->
    <!--addtivity:是否向上级loger传递打印信息。默认是true-->
    <logger name="com.liyuehong.weeklyreport" level="info" additivity="true">
        <!--可以有多个appender-ref，即将日志记录到不同的位置-->
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="rollFileLog"/>
    </logger>

    <!--root节点用于指定基础的日志输出级别-->
    <root level="info">
    </root>
</configuration>
```
1. 在application.properties中配置logging.config=classpath:logback.xml（项目启动后读取日志配置文件的地址）

#### 参考文献
- https://blog.csdn.net/inke88/article/details/75007649
- https://blog.csdn.net/mu_wind/article/details/99830829