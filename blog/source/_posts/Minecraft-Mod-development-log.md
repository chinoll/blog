---
title: Minecraft Mod开发日志
date: 2021-07-10 00:18:10
tags: 
- forge
- minecraft
- java
- mod
---
# 函数副作用
获取服务器所有玩家的列表
```java
FMLCommonHandler.instance().getMinecraftServerInstance().getPlayerList();
```
获取玩家所在的世界
```java
player.world
```
