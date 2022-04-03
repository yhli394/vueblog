---
toc: true
title: 04-JVM是如何执行方法调用的（上）？
date: 2022-1-21
tags: [《深入拆解Java虚拟机》]
categories:
- JVM
---

#### 可变长参数

 从 java5开始，允许一个方法中传入多个参数，即方法中的参数是可变长参数。定义可变长参数的方法时有以下注意事项：

- 一个方法中最多只能有一个可变长参数
- 可变长参数要处于参数中的最后一个位置

- 可变长参数的本质是基于数组实现

  ```java
  //定义一个方法，方法的参数是可变长参数
  void function(String... str) { }
  //在method方法中调用上述定义的方法
  void method(){
          function("1","2");
          function(new String[]{"1","2"});//可变长参数的本质是数组
      }
  ```

<!--more-->

#### 重载和重写

*重载（overload）*：指的是方法和方法之间的关系，如果两个方法（方法A和方法B），它们的方法名一样，但是参数类型或参数顺序或参数个数不一样，我们说这两个方法是重载关系。重载不仅可以是同一个类中不同方法之间构成重载，也可以是子类和父类中的方法构成重载，即子类中定义了和父类中非私有且非静态同名的方法，且这两个方法参数类型或参数顺序或参数个数不一样，那么这两个方法构成重载关系。

*重写（override）*：子类对父类中非私有且非静态的方法进行重新编写，在子类中重写的方法的返回类型可以比原方法返回类型小。重写允许子类在继承父类部分功能的同时，拥有自己独特的行为。例如，解析文件，分为两个步骤，第一步是读取，第二步是解析，可以在父类中定义一个方法只写读取文件的逻辑，然后在子类中重写该方法只写解析的逻辑。

隐藏：如果子类中定义了和父类中同名且同参数类型的非私有静态方法，那么说子类中的该方法隐藏了父类中的该方法。

```java
public class Father {
    /**
     * 定义一个返回类型为Number的方法
     * @param price
     * @return
     * @throws IOException
     */
    public Number actionPrice(double price) throws IOException {
        return price * 0.8;
    }
}
public class Son extends Father {
    /**
     * Integer为Number的子类
     * @param price
     * @return
     * @throws IOException
     */
    @Override
    public Integer actionPrice(double price) throws IOException {
        return (Integer) super.actionPrice(price);
    }
}
```

重载方法在编译过程中即可完成识别，可以认为Java虚拟机中不存在重载这一概念，Java编译器筛选重载方法的步骤：

- 阶段1：在不考虑基本类型自动装拆箱和可变长参数的情况下选取重载方法；
- 阶段2：如果在阶段1中没有找到对应的重载方法，那么在允许自动拆装箱，但不允许可变长参数的情况下选取重载方法；
- 阶段3：如果在阶段1和2中没有找到对应的重载方法，那么在允许自动拆装箱且允许可变长参数的情况下选取重载方法；

#### JVM的静态绑定和动态绑定

静态绑定：指在解析时能够直接识别目标方法的情况

动态绑定：指在运行过程中根据调用者的动态类型来识别目标方法的情况（父类有方法A，子类重写了方法A，对象C调用方法A，此时需要判定对象C是父类的对象还是子类的对象）

方法描述符（method descriptor）:JVM里面的术语，由方法的参数类型和返回类型组成

方法签名：由方法名和参数列表构成

JVM对于方法重写的判定：

- 子类中定义了父类中非私有且非静态方法同名的方法
- 两个方法的参数个数、参数顺序、参数类型一致
- **两个方法的返回类型一致**

Java语言对于方法重写的判定：

- 子类中定义了父类中非私有且非静态方法同名的方法
- 两个方法的参数个数、参数顺序、参数类型一致
- **两个方法的返回类型可以一样也可以不一样（具体指：子类中方法的返回类型是原方法的子类型也行）**

对于Java语言中重写而JVM中非重写的情况，编译器会通过生成**桥接方法**来实现Java中的重写语义

Java字节码中与调用相关的指令共有五种：

- invokestatic:用于调用静态方法
- invokespecial:用于调用私有实例方法，构造器，以及使用super关键字调用父类的实例方法或构造器，和所有实现接口的默认方法
- invokevirtual:用于调用非私有实例方法
- invokeinterface:用于调用接口方法
- invokedynamic:用于调用动态方法

示例：

```java

interface 客户 {
  boolean isVIP();
}

class 商户 {
  public double 折后价格(double 原价, 客户 某客户) {
    return 原价 * 0.8d;
  }
}

class 奸商 extends 商户 {
  @Override
  public double 折后价格(double 原价, 客户 某客户) {
    if (某客户.isVIP()) { // 调用isVIP()方法会被编译为invokeinterface指令      
      return 原价 * 价格歧视();//调用价格歧视()方法会被编译为invokestatic指令
    } else {
      return super.折后价格(原价, 某客户);// 调用折后价格(原价, 某客户)方法会被编译为invokespecial
    }
  }
  public static double 价格歧视() {
    // 咱们的杀熟算法太粗暴了，应该将客户城市作为随机数生成器的种子。
    return new Random()// 调用Random类的构造器会被编译为invokespecial指令
           .nextDouble()// 调用Random类的nextDouble()方法会被编译为invokevirtual指令
           + 0.8d;
  }
}
```

#### 参考文献

《深入拆解Java虚拟机》-郑雨迪











