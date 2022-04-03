---
toc: true
title: "谈谈java中日期的计算"
date: 2021-12-11 17:48
tags:
  - 周报项目
---
  最近周报项目中有一个需求：前端传过来一个时间，后端拿到这个时间后，如何找出这个时间所在周的时间范围？例如，前端传过来的时间是2021-12-11（星期六），后端就需要找到12-11号所在周的周一和周日分别是那一天？

  <!--more-->

## 基本概念

（1）日期：一般指的是年月日，例如2021-12-12表示一个日期；

（2）时间分为两种，一种是带日期的时间，例如：2021-12-12 20：52：53；另一种是不带日期的时间，例如：20：45：53

（3）时间戳：指从格林威治时间1970-1-1 00:00:00（北京时间1970-1-1 08:00:00）开始到现在的总秒数。时间戳简单来说就是一个时间标记，用来唯一标识确定生活中的特定的某个时间。可以把时间戳理解为“一种证明”。举个例子，小李在微信公众号上发了一篇文章，然后有一些人转载了这篇文章，那么怎样确定这篇文章的作者是谁呢？可以用时间戳来证明，小李在发了文章后，微信官方会给这篇文章添加一个时间标记，即时间戳，用于标记这篇文章。java中通过System.currentTimeMillis()获取当前的时间戳

（4）CST：可以看作是以下四个不同时区的缩写：

- 美国中部时间：Central Standard Time (USA) UT-6:00
- 澳大利亚中部时间：Central Standard Time (Australia) UT+9:30
- 中国标准时间：China Standard Time UT+8:00
- 古巴标准时间：Cuba Standard Time UT-4:00

## 常用日期类

### Date类

获得当前时间：

```java
Date date = new Date();
System.out.println(date);//Sat Dec 11 15:58:37 CST 2021
```

目前Date类中部分API，例如~~date.getDay()~~、~~date.getYear()~~等已经被遗弃了

常用SimpleDateFormat类(SimpleDateFormat extends DateFormat)来格式化日期:

```java
Date date = new Date();
//new SimpleDateFormat()中可以自定义日期的输出格式
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
System.out.println(sdf.format(date));//2021-12-11 16:12:34
```

### Calendar类

和Date类相比，可以做简单的日期和时间的运算

```java
//Calendar是一个抽象类，只能通过Calendar.getInstance()来获取Calendar的实例
Calendar c = Calendar.getInstance();
//Calendar通过get(int field)方法来获取日期
int year = c.get(Calendar.YEAR);
System.out.println(year);//2021
//Calendar源码中用数字0~11分别代表1月~12月
int month = c.get(Calendar.MONTH)+1;
System.out.println(month);//12
//Calendar.DAY_OF_MONTH获取今天是这个月的第几天
int dayOfMonth = c.get(Calendar.DAY_OF_MONTH);
System.out.println(dayOfMonth);//11
//用字符串拼接year,month,dayOfMonth
System.out.println(year+"-"+month+"-"+dayOfMonth);//2021-12-11
//Calendar中的getTime()方法可以将Calendar对象转化为Date对象，进而可以借助SimpleDateFormat类进行日期或者时间的格式化
System.out.println(sdf.format(c.getTime()));//2021-12-11 16:43:11
```

### LocalDateTime

```java
//获取本地日期和时间
LocalDateTime now = LocalDateTime.now();
System.out.println(now);//2021-12-11T17:07:39.359
//获取本地日期
LocalDate date = LocalDate.now();
System.out.println(date);//2021-12-11
//获取本地时间
LocalTime time = LocalTime.now();
System.out.println(time);//17:07:39.360
```

把字符串转化为LocalDateTime,传入字符串的格式需符合ISO 8601标准规定的格式:

```
日期：yyyy-MM-dd
时间：HH:mm:ss
带毫秒的时间：HH:mm:ss.SSS
//T为日期和时间的分隔符
日期和时间：yyyy-MM-dd'T'HH:mm:ss
带毫秒的日期和时间：yyyy-MM-dd'T'HH:mm:ss.SSS
```

字符串解析

```java
//解析本地日期和时间
LocalDateTime localDateTime = LocalDateTime.parse("2021-12-11T17:15:12");
System.out.println(localDateTime);//2021-12-11T17:15:12
//解析日期
LocalDate localDate = LocalDate.parse("2021-12-11");
System.out.println(localDate);//2021-12-11
//解析时间
LocalTime localTime = LocalTime.parse("17:16:50");
System.out.println(localTime);//17:16:50
```

使用DateTimeFormatter进行格式化

```java
//自定义日期格式
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
System.out.println(dtf.format(LocalDate.now()));//2021/12/11
//解析非标准的字符串
System.out.println(LocalDate.parse("2021/12/11", dtf));//2021-12-11
```

### 小结

从Java 8开始，`java.time`包提供了新的日期和时间API，例如LocalDateTime`，`LocalDate`，`LocalTime等

新API修正了旧API不合理的常量设计：

```java
Month的范围用1~12表示1月到12月
Week的范围用1~7表示周一到周日
```

## 解决周报问题

```java
public List<Article> selectByWeek(Date time){
    //日期格式化
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    //获得Calendar的对象
    Calendar cal = Calendar.getInstance();
    //设置时间
    cal.setTime(time);
    //获取今天是本周第几天（在美国周六是第七天）
    int i = cal.get(Calendar.DAY_OF_WEEK);
    //如果是第一天（即周日），往前倒一天
    if(i==1){
        cal.add(Calendar.DAY_OF_WEEK,-1);
    }
    //把MonDay设置为第一天
    cal.setFirstDayOfWeek(Calendar.MONDAY);
    //获取今天是本周第几天
    int day = cal.get(Calendar.DAY_OF_WEEK);
    cal.add(Calendar.DATE,cal.getFirstDayOfWeek()-day);
    //周一
    String monday = sdf.format(cal.getTime());
    cal.add(Calendar.DATE,6);
    //周日
    String sunday = sdf.format(cal.getTime());
    return articleService.selectByWeek(monday,sunday);
}
```

## 参考文献

- 廖雪峰官网：https://www.liaoxuefeng.com/

- java核心技术卷I





