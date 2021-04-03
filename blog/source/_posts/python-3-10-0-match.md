---
title: python 3.10.0 match语法
date: 2021-03-29 16:38:01
tags:
- python
---
近日，python的官网更新了3.10.0的alpha版本，我个人非常期待这次python的版本更新，因为在3.10.x中，python加入了结构模式匹配(Structural Pattern Matching)的语法。
python的结构模式匹配(下文简称模式匹配)类似于C/C++的switch语句。但python的模式匹配比C语言的switch语句功能强大。下面就来看看python的模式匹配。
python的模式匹配使用的关键字时match。
``` python
#运行上面的代码，如果输入1则输出"您输入了1",否则输出"您没输入1"。
x = int(input())
match x:
    case 1:
        print("您输入了1")
    case _:
        print("您没输入1")
```
下面是等价的C语言代码。
``` c
#include <stdio.h>
int main(void) {
    int x;
    scanf("%d",&x);
    switch(x) {
        case 1:
            printf("您输入了1\n");
            break;
        default:
            printf("您没输入1\n");
	    break;
    }
    return 0;
}
```
python的模式匹配不仅能匹配数字，还能直接匹配字符串。
``` python
#运行上面的代码，如果输入hello则输出"hello match"，否则输出"match hello"。
x = input()
match x:
    case "hello":
        print("hello match")
    case _:
        print("match hello")
```
下面是等价的C语言代码。
``` c
#include <stdio.h>
#include <string.h>
int main(void) {
    char array[10];
    scanf("%s",array);
    switch(strcmp(array,"hello")) {
        case 0:
            printf("hello match\n");
            break;
        default:
            printf("match hello\n");
            break;
    }
    return 0;
}
```
未完待续