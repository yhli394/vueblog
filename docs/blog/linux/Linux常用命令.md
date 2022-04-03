---
toc: true
title: Linux常用命令
date: 2022-2-28
tags: [Linux]
categories:
 - Linux
---

#### **xxx --help:列出xxx命令的使用方法**

- mkdir --help：提示mkdir命令怎样使用
- cd --help:提示cd命令怎样使用
- ......

#### clear:清屏

#### ls(list files)：列出当前目录下的所有文件

- ls -l(简写为ll)：列出不包括隐藏文件在内的所有文件的详细信息（包括时间，权限等）
- ls -a(all)：列出包括隐藏文件在内的所有文件

<!--more-->

#### mkdir(make directory)：创建新的文件夹

- mkdir test：在当前目录下创建一个名为test的文件夹
- mkdir -p ok/op：递归的创建文件夹，即在当前目录下创建一个名为ok目录，然后在ok目录下在创建一个名为op的目录

#### cd(change directory)：切换目录

- cd ..：使用相对路径切到当前目录的父目录上去
- cd ./op：使用相对路径切到当前目录下的子目录op中去
- cd /app/ok：使用绝对路径切换到ok目录上去

#### pwd(print working directory)：显示当前目录所在的路径

#### rmdir(remove directory)：删除空的目录

- rmdir op：删除当前目录下的op目录
- rmdir -p ok/op：一起删除ok和其子目录op

#### netstat:显示网络状态

- netstat -a:显示详细的网络状态

- netstat -i(interfaces):显示网卡列表

- netstat-s(statistics)：显示网络统计信息（包括tcp,ip,udp等）


#### rm:删除非空目录或文件

- rm -i test:删除当前目录下的test目录，-i参数会询问到底是否删除
- rm -r file:删除当前目录下的file文件及其内部的文件

#### mv:移动文件

- mv Singleton.jasm test：将当前目录下的Singleton.jasm文件移动到当前目录下的test目录中去

#### touch:修改指定文件的时间属性为当前系统时间，如果没有指定的文件，那么会创建一个文件

- touch nginx.conf:如果当前目录下没有nginx.conf文件，那么会新建一个nginx.conf文件

#### curl ifconfig.me和curl cip.cc这两个命令可以查看公网ip

#### cat(Concatenate(连接) FILE(s) to standard output):查看文件内容

- cat repositories.json:查看当前目录下的repositories.json文件中的内容

#### find:查找文件或目录所在的位置

- find / -name weekproject：在系统根目录及其子目录下，列出所有名为weekproject的文件夹所在的路径
- find . -name test：在当前目录及其子目录下，列出所有名为test的目录所在的路径

#### cp(copy file):拷贝文件到指定的位置

- cp xiaoli.txt file:将当前目录下的xiaoli.txt拷贝到当前目录下的file文件夹内
- cp -r file ok：将当前目录下的file目录复制到当前目录下的ok目录（如果要复制一个目录，则需要加上-r参数）

#### ping:用于检测是否与主机连通

- ping 47.101.198.23:检测当前主机(localhost)和主机(47.101.198.23)是否连通

#### uname:用于显示系统信息

- uname -a：显示当前系统的版本、时间等信息

#### top：类似于windows上的任务管理器

- top：查看进程，内存等相关信息

#### exit：退出终端

- exit:退出当前的命令处理窗口

#### gzip:用于压缩文件

- gzip my.txt：将当前目录下的my.txt文件压缩成my.txt.gz
- gzip my.txt.gz -dv:将当前目录下的my.txt.gz文件解压(-d:decompress)，并显示解压的执行过程(-v:verbose)

- gzip *:将当前目录下的所有文件进行压缩
- gzip -dv *：将当前目录下的所有压缩文件进行解压





























