---
title: docker安装mysql8.x
date: 2022-3-12
tags: [Docker]
categories: 
- Docker
---

​以前一直在用MySQL 5.7，最近打算做一个分布式项目，想体验一下MySQL 8.x版本，于是记录一下在云服务器上用docker安装MySQL 8.x的步骤以及遇到的坑。

首先，需要去https://hub.docker.com/_/mysql寻找mysql镜像，拉取最新的镜像即可：

```docker
docker pull mysql:latest
```

通过docker images，查看镜像是否拉下来了。

![docker安装mysql8.x-2022-03-13-15-52-53](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13-15-52-53.png)

接着，我们准备一个docker-compose.yml文件和一个my.cnf文件

docker-compose.yml文件：

```docker-compose.yml
#Using Compose is basically a three-step process:
#  Define your app’s environment with a Dockerfile so it can be reproduced anywhere.
#  Define the services that make up your app in docker-compose.yml so they can be run together in an isolated environment.
#  Run docker compose up and the Docker compose command starts and runs your entire app. You can alternatively run docker-compose up using the docker-compose binary.
version: "3.3"
services:
  # nginx:
  #  image: nginx:latest # 镜像版本
  #  ports:
  #    - "80:80" # 端口暴露
  #  volumes: # 将主机的数据卷或着文件挂载到容器里
  #    - /app/nginx/webafter:/usr/share/nginx/webafter
  #    - /app/nginx/nginx.conf:/etc/nginx/nginx.conf
  #    - /app/nginx/logs:/var/log/nginx # 
  #  privileged: true # 解决nginx文件调用权限
  
  mysql:
    image: mysql:latest
    ports:
      - "3307:3306" 
    environment: # 指定密码
      - MYSQL_ROOT_PASSWORD=123456
    restart: always
    container_name: mysql_latest
    volumes:
      - ./my.cnf:/etc/mysql/my.cnf
      - ./data:/var/lib/mysql
      
  # redis:
  #  image: aea9b698d7d1 # redis:latest的IMAGE ID
  #  ports: 
  #    - "6379:6379"

  # week:
  #  image: week:test
  #  build: . # 表示以当前目录下的Dockerfile开始构建镜像，由于单独执行过docker build -t week:v1 . 因此不用在这里使用build指令
  #  # When mapping ports in the HOST:CONTAINER format, you may experience erroneous results when using a container port lower than 60,
  #  # because YAML parses numbers in the format xx:yy as a base-60 value. For this reason,
  #  # we recommend always explicitly specifying your port mappings as strings.
  #  ports:
  #    - "8082:8082"
```

my.cnf文件：

```mysql
[mysqld]
#default_authentication_plugin=mysql_native_password
# skip-name-resolve
# skip-grant-tables #跳过权限验证 
# secure_file_priv=/var/lib/mysql
datadir=/var/lib/mysql
default-storage-engine=INNODB
character-set-server=UTF8MB4
[client]
default-character-set=UTF8MB4
[mysql]
default-character-set=UTF8MB4
```

​​在docker-compose.yml文件所在的目录，执行docker-compose up -d来实例化一个容器。

![docker安装mysql8.x-2022-03-13-16-04-07](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13-16-04-07.png)

通过View Logs查看容器日志，可以看到有报错，如上图所示，看到网上一片博客[1]说的是由于“MYSQL新特性secure_file_priv对读写文件的影响”，解决办法是在my.cnf中的[mysqld]下添加一句如下的话：

>  secure_file_priv=/var/lib/mysql

其次，通过docker exec -it 容器名或容器ID /bin/bash指令进去mysql容器内部，输入mysql -u root -p后点击回车，会提示输入密码，如果显示Welcome to the MySQL monitor.....，那么恭喜你现在mysql已经安装成功。如果提示“ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)”，解决思路如下：

（1）在my.cnf文件中添加一行skip-grant-tables （跳过权限验证）

（2）重启容器，然后进入容器内部，键入mysql -u root -p后点击回车，输入密码后就可以进入mysql内部

（3）输入show databases，显示数据库

![docker安装mysql8.x-2022-03-13](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13.png)

（4）输入use mysql切换数据库

（5）输入select user,host,authentication_string from user;

![docker安装mysql8.x-2022-03-13-15-56-04](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13-15-56-04.png)

（6）如果user=root所在的行的host值为localhost，说明mysql中的root用户只能通过本机连接，在windows电脑上通过sqlyog,navicat,idea等工具是不能连接的，需要修改host值为%，让非本机也可以连接。

```sql
update user set host='%' where user='root';
```

（7）如果user=root所在的行的authentication_string（root用户的密码）值为空，那么需要进行如下的设置：

```sql
ALTER user 'root'@'%' IDENTIFIED BY '123456';--修改密码为123456
```

（8）修改后需要刷新权限，如下：

```sql
flush privileges;
```

现在通过idea就可以连接上mysql8.x版本了，如果连接不上，可以切换一下驱动。如果用sqlyog连接报以下的错误：

![docker安装mysql8.x-2022-03-13-15-59-39](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13-15-59-39.png)

由于mysql8.x默认采用caching_sha2_password的方法认证用户，而mysql5.x默认采用mysql_native_password方法来认证用户。而sqlyog等可视化工具如果版本较老的话是不支持mysql8.x的认证方式。解决办法如下；

- 第一种解决办法是将sqlyog等可视化工具升级为最新版（虽然我没有试过，但是应该可以解决）；

- 第二中解决办法是将认证方式改为mysql_native_password，步骤如下：

  （1）如果root用户密码不为空，首先需要将密码置为空

  ```sql
  update user set authentication_string='' where user ='root';
  ```

  （2）然后刷新权限

  ```sql
  flush privileges;
  ```

  （3）最后修改认证方式为mysql_native_password

  ```sql
  ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
  ```

  （4）重新用sqlyog可视化工具连接，如下：

![docker安装mysql8.x-2022-03-13-15-56-54](https://imagecontainter-1309978559.cos.ap-chengdu.myqcloud.com/blogimages/docker安装mysql8.x-2022-03-13-15-56-54.png)

Notes：

- 如果mysql容器运行时映射出来的端口号为3306，那么需要让云服务器的防火墙开通对3306端口的访问。

#### 参考文献

[1] [(28条消息) 使用Docker安装mysql，挂载外部配置和数据时启动失败_一见的博客-CSDN博客](https://blog.csdn.net/qq_40604437/article/details/106680762)

[2] [(28条消息) ERROR 1396 (HY000): Operation ALTER USER failed for ‘root‘@‘localhost‘_张小凡-CSDN博客](https://blog.csdn.net/q258523454/article/details/84555847)

[3] [MySQL :: MySQL 8.0 Reference Manual :: 6.2.17 Pluggable Authentication](https://dev.mysql.com/doc/refman/8.0/en/pluggable-authentication.html#pluggable-authentication-compatibility)

[4] [(28条消息) MySql8.0修改root密码_wolf-CSDN博客_mysql8.0修改root密码](https://blog.csdn.net/wolf131721/article/details/93004013)

[5] [(28条消息) mysql8.0.15用户root登录开启远程访问权限_藤叶香来-CSDN博客_mysql8允许root远程连接](https://blog.csdn.net/liliuqing/article/details/88723409)

[6] [MySQL8.0.21 root 密码登陆不入-ERROR 1045(28000) Access denied for user 'root'@'localhost' (using password YES) - beawh - 博客园 (cnblogs.com)](https://www.cnblogs.com/vzhangxk/p/13357892.html)

