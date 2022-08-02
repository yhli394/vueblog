---
toc: true
title: SQL小技巧持续更新......
date: 2022-7-26
categories: 
- MySQL
tags: SQL笔记
---

MySQL中的Flow Control Function之CASE，CASE的语法如下：

CASE WHEN condition THEN result [WHEN condition THEN result...] ELSE result END

示例：

```mysql
select award_count, CASE WHEN award_count>200 AND award_count<=500 THEN '丰富'
    WHEN award_count<=100 AND award_count>=50 THEN '较为丰富'
    ELSE '稀少' END AS level from strategy_detail;
```
