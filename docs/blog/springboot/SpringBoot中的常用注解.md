---
toc: true
title: SpringBoot中的常用注解 
date: 2021-12-19
tags:
  - SpringBoot
categories:  
- Spring
sticky: 2
---

​SpringBoot接触了有几个月了，目前基本会用这个框架，但是底层的原理了解甚少。结合目前做过的一些项目，今天先来总结一下SpringBoot中的常用注解。

## 一、@Autowired、@Qualifier

- @Autowired:可用在方法、字段、参数、构造器以及注解声明上，实际开发中常在Controller层和Service层使用，多用在某个字段上，例如：

  ```java
  //Controller层调用Service层
  @Autowired
  ArticleService articleService;
  //Service层调用Dao层（Mapper层）
  @Autowired
  ArticleMapper articleMapper;
  ```

源码中对@Autowired的部分介绍如下：

> Marks a constructor, field, setter method, or config method as to be autowired by Spring's dependency injection facilities. This is an alternative to the JSR-330(java依赖注入标准) javax.inject.Inject annotation, adding required-vs-optional semantics.
>
> Autowired Fields
> Fields are injected right after construction of a bean, before any config methods are invoked. Such a config field does not have to be public.

@Autowired注入的类型只能有一个对象，当使用@Autowired注解的时候，如果注入的类型有多个对象，可以加上@Qualifier来指定注入那一个对象

- @Qualifier：qualifier翻译成中文有”限定符“之意，可用在方法、字段、参数、类、接口以及注解声明上；
- @Qualifier源码如下：

> This annotation may be used on a field or parameter as a qualifier for candidate beans when autowiring. It may also be used to annotate other custom annotations that can then in turn be used as qualifiers.

示例：

```java
@Configuration
public class Config {
    @Bean
    RespMsg respMsg1(){
        return new RespMsg("s");
    }

    @Bean
    RespMsg respMsg2(){
        return new RespMsg("s1");
    }
}

@RestController
public class Controller {
    //@Qualifier("respMsg1")
    @Autowired
    private RespMsg respMsg;//报错，报错信息如下：
    //Could not autowire. There is more than one bean of 'RespMsg' type.
    //Beans:
    //respMsg1 (Config.java)
    //respMsg2 (Config.java)
}
```

## 二、@RequestMapping、@GetMapping、@PostMapping、@PutMapping、@DeleteMapping

- @RequestMapping：作用于类、接口以及方法上，常用来指定映射的路径，其中的value元素用来指定映射路径和method元素用来指定请求方法

  示例1：

  ```java
   @RequestMapping(value = "/add",method = RequestMethod.POST)
  ```

  但是，如果用于方法上，经常使用的是@GetMapping、@PostMapping、@PutMapping、@DeleteMapping注解，这四个注解指定了请求方法，通常只需要填请求路径即可，减少了代码量，示例1等价于示例2。

  示例2：

  ```java
   @PostMapping(value = "/add")
  ```

## 三、@RestController、@Controller、@Service、@Component、@Repository

@Repository, @Service,  @Controller 这三个注解是在 @Component基础上衍生而来，这四个注解功能差不多，把被标记的类或者接口标记成一个组件，告诉Spring在做自动化检测和扫描的时候，把这个组件注册到容器中去

- @RestController：作用于类或者接口上，是一个组合注解（@ResponseBody和@Controller），除了把类或者接口标记为一个组件外，还让方法的返回值默认以json形式返回

- @Controller：用在Controller层，作用于类或者接口

- @Service：用在Service层，作用于类或者接口

- @Repository：作用于DAO层或者Mapper层，作用于类或者接口

- @Component：用于其他层，作用于类或者接口

  在xxxMapper接口上显式的添加@Repository或者@Component可以消除接口变量装配时的报错

  @MapperScan、@Mapper、@ConponentScan

  - @Mapper:写在xxxMapper接口上，用来标记这个接口，在自动化扫描的时候告诉mybatis，这个接口封装了相应的方法
  - @MapperScan(basePackages="要扫描的包"):在项目启动类上添加，可以自动扫描相应包下的所有接口，设置了@MapperScan就不用在每个接口上添加@Mapper了
  - @ConponentScan(basePackages="要扫描的包的路径，要用.不能用/")：将扫描指定包下的bean，并将其注册到spring容器中去，不是说类上就不用加@bean,在@SpringBootApplication注解中已经集成了@ComponentScan注解

## 四、@Bean、@Configuration

- @Bean

  首先需要理解什么是bean?下面是官方文档的内容:

> In Spring, the objects that form the backbone(骨干) of your application and that are managed by the Spring IoC container are called beans. A bean is an object that is instantiated, assembled, and managed by a Spring IoC container. Otherwise, a bean is simply one of many objects in your application. Beans, and the dependencies among them, are reflected in the configuration metadata used by a container.

可以把bean简单的理解为一个由Spring容器创建、装配、管理的对象

@Bean注解常用在被@Configuration标记的类中的方法上，告诉被@Bean标记的这个方法产生一个bean，并将这个bean交给Container这个容器来管理。默认的bean的名称为方法名，但是也可以通过@Bean(value = {"xxx"})来给bean取别名

使用@Bean注解的好处：可以动态获取一个对象，降低耦合度

以下内容摘自官方文档:

> The `@Bean` annotation is used to indicate that a method instantiates, configures, and initializes a new object to be managed by the Spring IoC container. For those familiar with Spring’s `<beans/>` XML configuration, the `@Bean` annotation plays the same role as the `<bean/>` element. You can use `@Bean`-annotated methods with any Spring `@Component`. However, they are most often used with `@Configuration` beans.

- @Configuration

  翻译成中文有“配置”的含义，用来标记类或者接口。

  以下内容摘自官方文档:

  > Annotating a class with `@Configuration` indicates that its primary purpose is as a source of bean definitions. Furthermore, `@Configuration` classes let inter-bean dependencies(bean对象之间的依赖关系) be defined by calling other `@Bean` methods in the same class. The simplest possible `@Configuration` class reads as follows:
  >
  > @Configuration 
  >
  > public class AppConfig {    
  >
  > ​	 @Bean   
  >
  > ​	 public MyService myService() {        
  >
  > ​			return new MyServiceImpl();   
  >
  > ​	 }
  >
  >  }

## 五、@PathVariable、@RequestBody、@RequestParam、@ResponseBody、@Param

- @ResponseBody：作用于类、接口、或者方法上，默认让方法的返回值以一个没有特殊含义（不会跳转）的json字符串形式返回
- @RequestBody：作用在参数上，使得请求的参数from body

```java
@PostMapping("/")
//@RequestBody会把前端传过来的数据反序列化为一个对象(来自官方文档)
//通过position对象接收前端传过来的json数据
    public RespBean addPosition(@RequestBody Position position){
        if(positionService.addPosition(position)==1){
            return RespBean.ok("添加成功");
        }
        return RespBean.error("添加失败");

    }
```

@PathVariable:作用于参数上，使得请求的参数from path
@RequestParam：注解有三个属性，分别是value,required,defaultValue,其中value属性是给方法中的参数起别名，required属性默认为true,即请求的url中必须包含参数名，defaultValue属性可以设置默认参数，设置了defaultValue属性，那么required属性自动转为false

@Param：如果不想使用mybatis自带的参数名[arg1,arg0,param1,param2]，可以在mapper接口文件里面的方法中的参数前加上本注解，如果方法只有一个参数，可以不用加本注解

源码：

> The annotation that specify the parameter name.
> How to use:
>    public interface UserMapper {
>      @Select("SELECT id, name FROM users WHERE name = #{name}")
>      User selectById(@Param("name") String value);
>    }

