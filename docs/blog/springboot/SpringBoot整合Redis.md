---
toc: true
title: SpringBoot整合Redis
date: 2022-2-20
tags: [SpringBoot]
categories: 
- Spring
sticky: 1
---
在SpringBoot中整合操作Redis目前已知有三种方案：Spring Data Redis，Spring Cache,Jedis等客户端连接。本篇博客介绍第二方案，即Spring Cache。

## SpringCache简介

::: tip
> Since version 3.1, the Spring Framework provides support for transparently adding caching to an existing Spring application. Similar to the transaction support, the caching abstraction allows consistent use of various caching solutions with minimal impact on the code.In Spring Framework 4.1, the cache abstraction was significantly extended with support for JSR-107 annotations and more customization options.

:::right
来自 [Spring官网](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
:::

上面摘自官网对Cache的介绍，文章中提到Cache Abstraction，中文译为缓存抽象，是一种门面（可以联想日志门面的作用）

## SpringCache常用注解

### @CacheConfig

> @CacheConfig:Shares some common cache-related settings at class-level-摘自官网

@CacheConfig注解**只能作用于类或接口上**，源码中的cacheNames属性常用，cacheNames用于指定缓存的名称，示例如下，此配置表明ArticleService类中的所有方法的cacheNames为article，在方法上面也可以单独指定cacheName，此时会隐藏掉@CacheConfig中全局配置的cacheName
```java
@Service
@CacheConfig(cacheNames = "article")
public class ArticleService {
    ......
}
```

### @Cacheable

> @Cacheable: Triggers cache population-摘自官网

@Cacheable注解一般**用在查询方法上面**，常用属性key和cacheNames，Cache Abstraction提供以下的算法来生成key:

> If no params are given, return SimpleKey.EMPTY.
If only one param is given, return that instance.
If more than one param is given, return a SimpleKey that contains all parameters.

**@Cacheable的原理**：当程序第一次调用标记有@Cacheable注解方法的时候，会执行方法体，并且将方法的返回值缓存起来；当第二次调用该方法的时候，程序会先根据key去缓存中搜索数据，如果找到了就直接返回，而不会执行方法体，如果未找到，会走数据库，然后将返回值缓存起来，即先走缓存，后走数据库，如果配置了数据库sql语句执行的日志，可以看到控制台不会有日志输出。

示例如下：

```java

@Cacheable(key ="#id")//#id使用的是Spring Expression Language (SpEL)语法
public Article showArticle(Integer id) {
    Article article = articleMapper.showArticle(id);
    return article;
}

@Cacheable(key = "#result")//result是方法的返回值
public List<Article> selectAllArticle(){
    return articleMapper.selectAllArticle();
}

```

SpEL语法官网链接：
> [Spring官网](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html)

### @CachePut

> @CachePut: Updates the cache without interfering with the method execution-摘自官网

@CachePut注解常用属性有key和cacheNames，**一般用在更新方法上**，用于更新缓存，**和@Cacheable的区别**在于被@CachePut标记的方法每当被调用的时候都会执行方法体中的内容，并且将返回值进行缓存

::: theorem
Using @CachePut and @Cacheable annotations on the same method is generally strongly discouraged because they have different behaviors. While the latter causes the method invocation to be skipped by using the cache, the former forces the invocation in order to run a cache update. This leads to unexpected behavior and, with the exception of specific corner-cases (such as annotations having conditions that exclude them from each other), such declarations should be avoided. Note also that such conditions should not rely on the result object (that is, the #result variable), as these are validated up-front to confirm the exclusion.

:::right
来自 [Spring官网](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
:::

官方不建议将@CachePut和@Cacheable注解用于同一个方法上

示例如下：

```java
@CachePut(key = "#uid")
public int updateUserRolesById(int uid,int[] rids) {
    int j = userMapper.deleteUserRolesById(uid);
    int i = userMapper.updateUserRolesById(uid,rids);
    return i;
}
```

### @CacheEvict

> @CacheEvict: Triggers cache eviction-摘自官网

@CacheEvict注解主要用于删除缓存，常用属性有key,cacheNames,beforeInvocation，其中，beforeInvocation属性默认为false，即在方法调用之后在删除缓存

示例如下：

```java
@CacheEvict(key = "#uid")
public List<Article> selectByUserId(Integer uid){
    ......
}
```

### @Caching

> @Caching: Regroups multiple cache operations to be applied on a method

@Caching注解是一个组合注解，包含了@Cacheable,@CachePut以及@CacheEvict这三个注解，用于复杂缓存逻辑的处理

示例代码：

```java
@Caching(evict = @CacheEvict(key = "#uid",beforeInvocation = true),put = @CachePut(key = "#uid"))
public int updateUserRolesById(int uid,int[] rids) {
    int j = userMapper.deleteUserRolesById(uid);
    int i = userMapper.updateUserRolesById(uid,rids);
    return i;
}
```

## 项目配置

- 添加依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
            <version>2.6.3</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
            <version>2.6.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
```

- 在项目启动类上或者RedisConfig类上添加@EnableCaching注解
  
示例如下：

```java
@SpringBootApplication
@MapperScan(basePackages = "com.xxx")
@EnableCaching
public class WeeklyReportApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeeklyReportApplication.class, args);
    }

}
```

```java

@Configuration
//开启基于注解的缓存
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {
    ......
}
```

- RedisConfig配置类代码

```java
@Configuration
//开启基于注解的缓存
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {

    final static Logger logger = LoggerFactory.getLogger(RedisConfig.class);

    FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
    /**
     * 更换SpringSession中默认的序列化器
     * @return
     */
//    @Bean("springSessionDefaultRedisSerializer")
//    public RedisSerializer setSerializer(){
//        return fastJsonRedisSerializer;
//    }

    /**
     * 自定义缓存管理器
     * @param connectionFactory
     * @return
     */
    @Bean
    public CacheManager CustomCacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheManager customCacheManager = RedisCacheManager.RedisCacheManagerBuilder
                //Redis链接工厂
                .fromConnectionFactory(connectionFactory)
                //缓存默认存储一小时
                .cacheDefaults(getCacheConfigurationWithTtl(Duration.ofHours(1)))
                //配置同步修改或删除  put/evict
                .transactionAware()
                //对于不同的cacheName设置不同的过期时间
//                .withCacheConfiguration("week",getCacheConfigurationWithTtl(Duration.ofHours(2)))
//                .withCacheConfiguration("user",getCacheConfigurationWithTtl(Duration.ofHours(1)))
                .build();
        return customCacheManager;
    }


    /**
     * 自定义缓存信息配置
     * @param duration
     * @return
     */
    private RedisCacheConfiguration getCacheConfigurationWithTtl(Duration duration) {
        return RedisCacheConfiguration
                .defaultCacheConfig()
                //设置key和value的序列化方式
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(fastJsonRedisSerializer))
                // 不缓存null
                .disableCachingNullValues()
                // 设置缓存的过期时间
                .entryTtl(duration)
                //修改redis中key的前缀
                .computePrefixWith(cacheName -> cacheName+":");
    }


    /**
     * 不设置主键时的生成策略：类名+方法名+参数
     * @return
     */
    @Override
    @Bean
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                StringBuffer sb = new StringBuffer();
                sb.append(target.getClass().getName());
                sb.append(method.getName());
                for (Object obj : params
                ) {
                    sb.append(obj.toString());
                }
                return sb.toString();
            }
        };
    }


    /**
     * 配置缓存异常处理
     * @return
     */
    @Bean
    @Override
    public CacheErrorHandler errorHandler() {
        logger.info("初始化 -> [{}]", "Redis CacheErrorHandler");
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
                logger.error("Redis occur handleCacheGetError：key -> [{}]", key, e);
            }

            @Override
            public void handleCachePutError(RuntimeException e, Cache cache, Object key, Object value) {
                logger.error("Redis occur handleCachePutError：key -> [{}]；value -> [{}]", key, value, e);
            }

            @Override
            public void handleCacheEvictError(RuntimeException e, Cache cache, Object key) {
                logger.error("Redis occur handleCacheEvictError：key -> [{}]", key, e);
            }

            @Override
            public void handleCacheClearError(RuntimeException e, Cache cache) {
                logger.error("Redis occur handleCacheClearError：", e);
            }
        };
    }


    /**
     * 自定义redisTemplate
     * @param factory
     * @return
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(fastJsonRedisSerializer);
        redisTemplate.setHashValueSerializer(fastJsonRedisSerializer);
        redisTemplate.setHashKeySerializer(fastJsonRedisSerializer);
        redisTemplate.setConnectionFactory(factory);
        return redisTemplate;
    }

    /**
     * 自定义stringRedisTemplate
     * @param factory
     * @return
     */
    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        StringRedisTemplate stringRedisTemplate = new StringRedisTemplate();
        stringRedisTemplate.setKeySerializer(new StringRedisSerializer());
        stringRedisTemplate.setValueSerializer(fastJsonRedisSerializer);
        stringRedisTemplate.setConnectionFactory(factory);
        stringRedisTemplate.setHashValueSerializer(fastJsonRedisSerializer);
        return stringRedisTemplate;
    }
}

```

- 自定义FastJsonRedisSerialize的实现方式

```java
public class FastJsonRedisSerializer<T> implements RedisSerializer<T> {
    private ObjectMapper objectMapper = new ObjectMapper();
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");
    private static Logger logger = LoggerFactory.getLogger(FastJsonRedisSerializer.class);

    private Class<T> clazz;

    static {
        // 全局开启AutoType，这里方便开发，使用全局的方式
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
        // 建议使用这种方式，小范围指定白名单
//         ParserConfig.getGlobalInstance().addAccept("com.xxx.xxx");
        // key的序列化采用StringRedisSerializer
    }

    public FastJsonRedisSerializer(Class<T> clazz) {
        super();
        this.clazz = clazz;
    }

    /**
     * 将序列化时默认存储byte改为默认存储json
     * @param t
     * @return
     * @throws SerializationException
     */
    @Override
    public byte[] serialize(T t) throws SerializationException {
//        logger.debug("序列化");
        if (t == null) {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    /**
     * 将反序列化时默认存储byte改为默认存储json
     * @param bytes
     * @return
     * @throws SerializationException
     */
    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
//        logger.debug("反序列化");
        if (bytes == null || bytes.length <= 0) {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);
        return JSON.parseObject(str, clazz);
    }
}
```

## 参考文献

- <https://blog.csdn.net/zhang19903848257/article/details/115144049>

- <https://blog.csdn.net/weixin_36279318/article/details/82820880>

- <https://www.cnblogs.com/coding-one/p/12408631.html>

- <https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache-annotations-cacheable>
