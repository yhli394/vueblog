---
title: SQL大厂面试真题
date: 2022-7-26
tags: 
- 牛客SQL题库
categories:
- MySQL
---

## 某音短视频

### SQL156 各个视频的平均完播率

问题：计算2021年里有播放记录的每个视频的完播率(结果保留三位小数)，并按完播率降序排序。
注：视频完播率是指完成播放次数占总播放次数的比例。简单起见，结束观看时间与开始播放时间的差>=视频时长时，视为完成播放。

```mysql
SELECT t1.video_id, ROUND(SUM(IF(TIMESTAMPDIFF(SECOND,start_time,end_time)>=duration,1,0))/count(start_time),3) AS avg_comp_play_rate
FROM tb_user_video_log AS t1 INNER JOIN tb_video_info AS t2 ON t1.video_id = t2.video_id
WHERE YEAR(start_time) = '2021'
GROUP BY t1.video_id
ORDER BY avg_comp_play_rate DESC
```

总结：

ROUND(X,D)：数X四舍五入保留D位小数，例如ROUND(1.298,1)结果为1.3

TIMESTAMPDIFF(unit,expr1,expr2)：计算两个日期或时间的差值(expr2-expr1)，例如TIMESTAMPDIFF(SECOND,'2020-09-01 10:00:00', '2020-09-01 10:01:42')结果为102

IF(expr1,expr2,expr3)：类似于java中的三目表达式，如果expr1为真，返回expr2，否则返回expr3，例如IF(1>2,2,3)结果为3

按组进行聚集运算，都要使用GROUP BY子句

使用where子句、inner join、left join、right join等进行联结返回的是一张表，如果多张表都有相同的字段field，field字段的使用需要使用全限定名（表名.field），如果字段field唯一，可以不需要使用全限定名

### SQL157 平均播放进度大于60%的视频类别

问题：计算各类视频的平均播放进度，将进度大于60%的类别输出。

```mysql
SELECT tag,CONCAT(ROUND(AVG(IF(TIMESTAMPDIFF(SECOND,start_time,end_time)-duration>=0,1,TIMESTAMPDIFF(SECOND,start_time,end_time)/duration))*100,2),'%') AS avg_play_progress
FROM tb_user_video_log t1 INNER JOIN tb_video_info t2 ON t1.video_id = t2.video_id 
GROUP BY tag
HAVING avg_play_progress>60
ORDER BY avg_play_progress DESC
```

总结：

如何输出百分数，可以用CONCAT，例如CONCAT(20,'%')

注意逗号要使用英文的逗号

AVG()函数计算平均值

### SQL158 每类视频近一个月的转发量/率

统计在有用户互动的最近一个月（按包含当天在内的近30天算，比如10月31日的近30天为10.2~10.31之间的数据）中，每类视频的转发量和转发率（保留3位小数）。注：转发率＝转发量÷播放量。结果按转发率降序排序。

```java
SELECT tag,SUM(if_retweet) AS retweet_cut,ROUND(SUM(if_retweet)/COUNT(start_time),3) AS retweet_rate
FROM tb_user_video_log AS t1 INNER JOIN tb_video_info AS t2 ON t1.video_id = t2.video_id
WHERE DATEDIFF((SELECT MAX(DATE(start_time)) FROM tb_user_video_log),DATE(start_time))<=29
GROUP BY tag
ORDER BY retweet_rate DESC
```

总结：

DATEDIFF(expr1,expr2)：提取expr1和expr2两个表达式中的日期部分，通过expr1-expr2计算两个日期的差值。例如，DATEDIFF('2010-11-30 23:52:20','2010-11-15')结果为15

DATEDIFF中的子查询SELECT MAX(DATE(start_time)) FROM tb_user_video_log需要加括号变为(SELECT MAX(DATE(start_time)) FROM tb_user_video_log)，以避免发生歧义。

### SQL159 每个创作者每月的涨粉率及截止当前的总粉丝量

问题：计算2021年里每个创作者每月的涨粉率及截止当月的总粉丝量。
注：
涨粉率=(加粉量 - 掉粉量) / 播放量。结果按创作者ID、总粉丝量升序排序。
if_follow-是否关注为1表示用户观看视频中关注了视频创作者，为0表示此次互动前后关注状态未发生变化，为2表示本次观看过程中取消了关注。

```mysql
SELECT author,DATE_FORMAT(start_time,'%Y-%m') AS month,
ROUND((SUM(IF(if_follow=1,1,0))-SUM(IF(if_follow=2,1,0)))/COUNT(start_time),3) AS fans_growth_rate,
SUM(SUM(IF(if_follow=1,1,0))-SUM(IF(if_follow=2,1,0))) OVER (PARTITION BY author ORDER BY DATE_FORMAT(start_time,'%Y-%m')) AS total_fans
FROM tb_user_video_log t1 INNER JOIN tb_video_info t2 ON t1.video_id = t2.video_id
WHERE YEAR(start_time) = 2021
GROUP BY author,month
ORDER BY author,total_fans
```

总结：

如何只显示日期中的年份和月份：可以使用DATE_FORMAT(date,format)函数，例如DATE_FORMAT('2022-07-29','%Y-%m')结果为2022-07

如何按月份累计统计粉丝数总数：使用MySQL中的窗口函数，即：

```mysql
SUM(SUM(IF(if_follow=1,1,0))-SUM(IF(if_follow=2,1,0))) OVER (PARTITION BY author ORDER BY DATE_FORMAT(start_time,'%Y-%m')) AS total_fans
```

上面句子的意思：先按照author进行分组，然后针对每个组按照格式化后的start_time进行排序，在对每个组实行累计求和。

ORDER BY子句对多个列进行排序，只用逗号分隔就行了。

GROUP BY 子句按多个列进行分组，用逗号分隔即可。

### SQL160 国庆期间每类视频点赞量和转发量

统计2021年国庆头3天每类视频每天的近一周总点赞量和一周内最大单天转发量，结果按视频类别降序、日期升序排序。假设数据库中数据足够多，至少每个类别下国庆头3天及之前一周的每天都有播放记录。

```mysql
SELECT *
FROM (
SELECT tag,dt,
SUM(like_cnt) OVER w AS sum_like_cnt_7d,
MAX(retweet_cnt) OVER w AS max_retweet_cnt_7d
FROM (SELECT tag,DATE(start_time) AS dt,SUM(if_like) AS like_cnt,SUM(if_retweet) AS retweet_cnt
      FROM tb_user_video_log AS t1 INNER JOIN tb_video_info AS t2 ON t1.video_id = t2.video_id
      WHERE DATE(start_time) BETWEEN '2021-09-25' AND '2021-10-03'
      GROUP BY tag,dt
     ) AS t1
WINDOW w AS(PARTITION BY tag ORDER BY dt DESC ROWS BETWEEN CURRENT ROW AND 6 FOLLOWING) 
) AS t2
GROUP BY tag,dt
HAVING dt BETWEEN '2021-10-01' AND '2021-10-03'
ORDER BY tag DESC,dt
```

## 用户增长场景（某度信息流）

### SQL162 2021年11月每天的人均浏览文章时长

统计2021年11月每天的人均浏览文章时长（秒数），结果保留1位小数，并按时长由短到长排序。

```mysql
SELECT DATE_FORMAT(in_time,'%Y-%m-%d') AS dt,ROUND(SUM(IF(artical_id=0,0,TIMESTAMPDIFF(SECOND,in_time,out_time)))/COUNT(DISTINCT uid),1) AS avg_viiew_len_sec
FROM tb_user_log
# WHERE dt BETWEEN '2021-11-01' AND '2021-11-30'
GROUP BY dt
HAVING dt BETWEEN '2021-11-01' AND '2021-11-30' 
ORDER BY avg_viiew_len_sec
```

总结：

where子句中使用字段别名会报错，例如以下的例子：

```mysql
select id AS h from elec_inverter_first_data where h=1;
```

在IDEA中测试发现会报错Unable to resolve column h

COUNT(DISTINCT 字段):统计不重复的行数