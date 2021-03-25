---
title: chinoGL的简介
date: 2021-03-25 23:33:01
tags: 
- chinoGL
- OpenGL
- python
- 图形学
categories:
- chinoGL
---

在介绍chinoGL之前，先来介绍一下openGL。
什么是OpenGL?
OpenGL（英语：Open Graphics Library，译名：开放图形库或者“开放式图形库”）是用于渲染2D、3D矢量图形的API。
OpenGL常用于CAD、虚拟现实、科学可视化程序和电子游戏开发。
OpenGL的高效实现（利用图形加速硬件）存在于Windows，部分UNIX平台和Mac OS。这些实现一般由显示设备厂商提供，而且非常依赖于该厂商提供的硬件。开放源代码库Mesa是一个纯基于软件的图形API，它的代码兼容于OpenGL。但是，由于许可证的原因，它只声称是一个“非常相似”的API。<br>
什么是chinoGL？
chinoGL是用于渲染2D，3D矢量图形的跨平台API，chinoGL使用纯软件实现，不使用硬件加速（暂时）。
chinoGL的目标是用纯软件来实现openGL的所有功能，但API和OpenGL的API不兼容。chinoGL用于给学习图形学的新手提供具体算法的参考代码。
chinoGL目前能处理3D矢量图形吗？
由于chinoGL还处于起步阶段，所以还不支持3D矢量图形的处理和绘制，目前只能处理2D图形。

[chinoGL](https://github.com/chinoproject/chinoGL)