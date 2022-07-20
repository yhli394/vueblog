---
title: SQL基础强化
date: 2022-7-12
tags: 
- 牛客SQL题库
categories:
- MySQL
---

## 检索数据

### SQL60 从 Customers 表中检索所有的 ID

现有表Customers，编写 SQL 语句，从 Customers 表中检索所有的cust_id。

```mysql
select cust_id from Customers;
```

### SQL61 检索并列出已订购产品的清单

表OrderItems含有非空的列prod_id代表商品id，包含了所有已订购的商品（有些已被订购多次）。编写SQL 语句，检索并列出所有已订购商品（prod_id）的去重后的清单。

```mysql
select distinct prod_id from OrderItems;
```
关键：DISTINCT去重，必须放到列名的前面。select distinct award_type,award_content from award;这个查询语句中，如果award_content列有三个不一样的，award_type列只有两个不一样的，那么查询的结果会返回三行

### SQL62 检索所有列

现在有Customers 表（表中含有列cust_id代表客户id，cust_name代表客户姓名），编写 SQL语句，检索所有列。

```mysql
select cust_id,cust_name from Customers;
```

## 排序检索数据

### SQL63 检索顾客名称并且排序

有表Customers，cust_id代表客户id，cust_name代表客户姓名。从 Customers 中检索所有的顾客名称（cust_name），并按从 Z 到 A 的顺序显示结果。

```mysql
select cust_name from Customers order by cust_name desc;
```

### SQL64 对顾客ID和日期排序

编写 SQL 语句，从 Orders 表中检索顾客 ID（cust_id）和订单号（order_num），并先按顾客 ID 对结果进行排序，再按订单日期倒序排列。

```mysql
SELECT cust_id,order_num 
FROM Orders 
ORDER BY cust_id ,order_date DESC;
```

### SQL65 按照数量和价格排序

编写 SQL 语句，显示 OrderItems 表中的数量（quantity）和价格（item_price），并按数量由多到少、价格由高到低排序。

```mysql
SELECT quantity,item_price 
FROM OrderItems 
ORDER BY quantity DESC,item_price DESC;
```

### SQL66 检查SQL语句

下面的 SQL 语句有问题吗？尝试将它改正确，使之能够正确运行，并且返回结果根据vend_name逆序排列

```mysql
SELECT vend_name
FROM Vendors 
ORDER BY vend_name DESC;
```

总结：

- ORDER BY子句默认是升序排序（对字母来说是A到Z，对数字来说是1，2，3...），如果需要降序排序，可以使用DESC 。

- select award_id,award_name from award order by award_id,award_name;其中award_id列的值都不相同，执行本SQL语句并不会对award_name列进行排序

- select award_type,award_name from award order by award_type,award_name;其中award_type列有5行值为1，5行值为4。执行本SQL语句会分别对award_name中与1在同一行和与4在同一行的数据进行排序，不会进行整体排序。

- 如果需要查询某列的最大值，可以使用如下语句：select xxx from table order by desc limit 1;

## 过滤数据

### SQL67 返回固定价格的产品

从 Products 表中检索产品 ID（prod_id）和产品名称（prod_name），只返回价格为 9.49 美元的产品。

```mysql
SELECT prod_id,prod_name
FROM Products
WHERE prod_price = 9.49
```

### SQL68 返回更高价格的产品

编写 SQL 语句，从 Products 表中检索产品 ID（prod_id）和产品名称（prod_name），只返回价格为 9 美元或更高的产品。

```mysql
SELECT prod_id,prod_name
FROM Products
WHERE prod_price >=9;
```

### SQL69 返回产品并且按照价格排序

编写 SQL 语句，返回 Products 表中所有价格在 3 美元到 6 美元之间的产品的名称（prod_name）和价格（prod_price），然后按价格对结果进行排序

```mysql
SELECT prod_name,prod_price
FROM Products
WHERE prod_price BETWEEN 3 AND 6 ORDER BY prod_price;
```

### SQL70 返回更多的产品

从 OrderItems 表中检索出所有不同且不重复的订单号（order_num），其中每个订单都要包含 100 个或更多的产品。

```mysql
SELECT DISTINCT order_num
FROM OrderItems 
WHERE quantity>=100;
```

总结：

- ORDER BY 和 WHERE子句一起用， ORDER BY位于WHERE的后面

- 当判断的列是串类型的时候，需要加单引号''，如果是值类型，就不需要加

- 检索字段xxx为null的行，可以这样写：select 要查询的字段 from 要查询的表 where xxx is null;

## 高级数据过滤

### SQL71 检索供应商名称

编写 SQL 语句，从 Vendors 表中检索供应商名称（vend_name），仅返回加利福尼亚州的供应商（这需要按国家[USA]和州[CA]进行过滤，没准其他国家也存在一个CA）

```mysql
SELECT vend_name
FROM Vendors
WHERE vend_country='USA' AND vend_state='CA';
```

### SQL72 检索并列出已订购产品的清单

编写SQL 语句，查找所有订购了数量至少100 个的 BR01、BR02 或BR03 的订单。你需要返回 OrderItems 表的订单号（order_num）、产品 ID（prod_id）和数量（quantity），并按产品 ID 和数量进行过滤。

解法一：

```mysql
SELECT order_num,prod_id,quantity
FROM OrderItems
WHERE quantity>=100 AND prod_id in('BR01','BR02','BR03');
```

解法二：

```mysql
SELECT order_num,prod_id,quantity
FROM OrderItems
WHERE quantity>=100 AND prod_id!='BR017';
```

### SQL73 返回所有价格在 3美元到 6美元之间的产品的名称和价格

编写 SQL 语句，返回所有价格在 3美元到 6美元之间的产品的名称（prod_name）和价格（prod_price），使用 AND操作符，然后按价格对结果进行升序排序

```mysql
SELECT prod_name,prod_price
FROM Products
WHERE prod_price BETWEEN 3 AND 6 
ORDER BY prod_price
```

### SQL74 纠错2

错误的sql

```mysql
SELECT vend_name 
FROM Vendors 
ORDER BY vend_name 
WHERE vend_country = 'USA' AND vend_state = 'CA';
```

修改后的sql:

```mysql
SELECT vend_name 
FROM Vendors 
WHERE vend_country = 'USA' AND vend_state = 'CA'
ORDER BY vend_name; 
```

## 用通配符进行过滤

### SQL75 检索产品名称和描述（一）

编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中包含 toy 一词的产品名称

```mysql
SELECT prod_name,prod_desc
FROM Products
WHERE prod_desc like '%toy%';
```

### SQL76 检索产品名称和描述（二）

编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中未出现 toy 一词的产品，最后按”产品名称“对结果进行排序。

```mysql
SELECT prod_name,prod_desc 
FROM Products
WHERE prod_desc NOT Like '%toy%'
ORDER BY prod_name;
```

### SQL77 检索产品名称和描述（三）

编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中同时出现 toy 和 carrots 的产品。有好几种方法可以执行此操作，但对于这个挑战题，请使用 AND 和两个 LIKE 比较。

```mysql
SELECT prod_name,prod_desc 
FROM Products
WHERE prod_desc Like '%toy%' AND prod_desc Like '%carrots%';
```

### SQL78 检索产品名称和描述（四）

编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回在描述中以先后顺序同时出现 toy 和 carrots 的产品。提示：只需要用带有三个 % 符号的 LIKE 即可。

```mysql
SELECT prod_name,prod_desc 
FROM Products
WHERE prod_desc Like '%toy%carrots%';
```

总结：

- 百分号%是通配符，但不能匹配null，下划线_只能匹配单个字符
- LIKE操作符的否定为NOT LIKE

