---
toc: true
title: IDEA中配置注释模板和自定义快捷键
date: 2022-2-26
tags: [IntelliJ IDEA]  
---
#### Javadoc

> **Javadoc**（最初是**JavaDoc**）[[1\]](https://zh.wikipedia.org/wiki/Javadoc#cite_note-1)是由[Sun Microsystems](https://zh.wikipedia.org/wiki/Sun_Microsystems)为[Java](https://zh.wikipedia.org/wiki/Java)语言（现在由[甲骨文公司](https://zh.wikipedia.org/wiki/甲骨文公司)拥有）创建的文档生成器，用于从Java源代码生成[HTML](https://zh.wikipedia.org/wiki/HTML)格式的[API](https://zh.wikipedia.org/wiki/应用程序接口)文档，HTML格式用于增加将相关文档[链接](https://zh.wikipedia.org/wiki/超連結)在一起的便利性。[[2\]](https://zh.wikipedia.org/wiki/Javadoc#cite_note-2)，Javadoc不影响Java中的性能，因为在编译时会删除所有注释--维基百科

何为Javadoc，简单来说javadoc就是一个文档工具，可以生成帮助理解源代码的文档，一般在类，方法，字段等地方使用javadoc格式的注释，然后就可以生成文档了（在IntelliJ IDEA中左上方Tools→Generate JavaDoc就可以生成javadoc文档）

<!--more-->

#### 类注释

在IDEA中，点击File→Settings→Editor→File and Code Templates，点击右边的Files选项，点击Class,Interface,Enum等类，可以看到右边框中有#parse("File Header.java")，示例如下：

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end
#parse("File Header.java")
public class ${NAME} {
}
```

在Includes菜单中，可以看到有一个File Header.java的文件，可以在里面设置创建类，接口时自动生成的注释信息，示例如下：

```java
/**
 * @ClassName ${NAME}.java
 * @author ${USER}
 * @packageName ${PACKAGE_NAME}
 * @createTime ${YEAR}年${MONTH}月${DAY}日 ${HOUR}:${MINUTE}:00
 */
```

#parse("File Header.java") 表示该类或者接口会引用File Header.java中定义的注释模板信息

在IDEA中新建一个Hello类进行测试，结果如下，可以看到在Hello类的上方生成了我们自定义的注释模板信息

```java
package com.liyuehong.weeklyreport.utils;

/**
 * @author yhli3
 * @ClassName Hello.java
 * @packageName com.liyuehong.weeklyreport.utils
 * @createTime 2022年02月26日 16:19:00
 */
public class Hello {
}
```

#### 方法注释

在IDEA中，点击File→Settings→Editor→Live Templates，点击右上角的➕号，新建一个Template Group，命名为CustomTemplate，然后光标停留在CustomTemplate上，再点击右上角的➕，创建一个Live Template，在Abbreviation（缩写）中输入*，右边的Description(填写简单的描述信息)中输入customMethodComments，在Template text中自定义内容，示例如下，注意最上面只有一颗星

```java
*
 * @description $description$
 * @author $user$ 
 * @param $param$
 * @updateTime $date$ $TIME$
 * @return $return$
 */
```

如果Template text中自定义内容如下（注意最上面是/**）：

```java
 /**
 * @description $description$
 * @author $user$ 
 * @param $param$
 * @updateTime $date$ $TIME$
 * @return $return$
 */
```

那么在方法上注释的时候会多出来/*：

```java
/*/**
* @description 
* @author yhli3
* @param [code, message, reasonPhrase]
* @updateTime 2022/2/26 16:37
* @return 
*/
```

在Edit variables中可以对被$$包围的变量赋值

#### 字段注释

在IDEA中也采用javadoc来注释，先在字段上方打出/**，接在点击回车键（enter），就可以生成javadoc注释模板，然后可以添加该字段的相关信息

#### 自定义快捷键

每次想要打印日志的时候，都需要在相应的类中创建如下一行代码：

```java
 private final static Logger logger = LoggerFactory.getLogger(xxx.class);
```

我们可以通过自定义快捷键来快速打出上面的代码，和设置方法注释模板类似，我们在CustomTemplate中创建一个Live Template，在Abbreviation中我们可以设置快捷键，这里设置为psl，Description中可以随意填写，这里填写为private static Logger logger，Template text中的内容如下：

```java
private static Logger logger = LoggerFactory.getLogger($CLASS_NAME$.class);
```

然后在Edit variables中为CLASS_NAME变量设置Expression为className()

最下面有一个提示Define（如果是第一次设置），点击提示Define可以设置快捷键的作用域，一般在Everywhere下的Java选项上打✔，也可以全局配置，如果已经设置好了，Define提示会变成Change提示，点击Change可以修改作用域

现在在ArticleService类中键入psl，再点击Tab或者enter就可以生成以下的代码：

```java
private static Logger logger = LoggerFactory.getLogger(ArticleService.class);
```

#### 参考文献

- [IDEA 创建类注释模板和方法注释模板 - 简书 (jianshu.com)](https://www.jianshu.com/p/14bb2f15d6f9)

- [(57条消息) IntelliJ IDEA软件中的LiveTemplate的使用教程_初一 十五的博客-CSDN博客](https://blog.csdn.net/weixin_43457486/article/details/84870765)

- [(57条消息) IntelliJ IDEA 添加方法注释 param为null的解决方案_仙甍的博客-CSDN博客_idea方法注释模板param为空的](https://blog.csdn.net/bobiexian4166/article/details/110080509)

