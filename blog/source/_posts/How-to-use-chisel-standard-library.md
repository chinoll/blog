---
title: 如何使用Chisel标准库
date: 2021-06-15 23:44:07
tags:
- chisel
- 笔记
- scala
---
# Decoupled:标准的Ready-Valid接口
Chisel提供的常用接口之一是 `DecoupledIO`，为传输数据提供一个随时有效的接口。
`DecoupledIO`的原理是，当源端有数据要传入时使能`valid`信号，并且将数据传入`bits`。
当接收器准备好接受数据时，使能`ready`信号，当`ready`和 `valid`在一个周期内都被使能时，数据被认为是被传输的。

`DecoupledIO` Bundle的字段：
- `valid`: Output(Bool)
- `ready`: Input(Bool)
- `bits`: Output(UInt(width.W(or U)))
# Flipped
`Flipped`会改变`DecoupledIO`的`bits`字段的默认方向,`DecoupledIO`的`bits`字段默认方向是Output，在使用`Flipped`之后，`bits`字段的方向会变为Input。
下面两段代码是等价的。
```scala
    val in = Decoupled(UInt(8.W))
```
```scala
  val in = new Bundle {
    val valid = Output(Bool())
    val ready = Input(Bool())
    val bits  = Output(UInt(8.W))
  }
```
在使用`Flipped`之后，`DecoupledIO`的输出方向会变成Input。
下面两段代码也是等价的。
```scala
    val in = Flipped(Decoupled(UInt(8.W)))
```
```scala
  val in = new Bundle {
    val valid = Input(Bool())
    val ready = Output(Bool())
    val bits  = Input(UInt(8.W))
  }
```
# Queue
`Queue`创建一个FIFO队列，两边都有Decoupled接口，允许背压(backpressure)。数据类型和元素的数量都是可配置的。

# Code
首先用`sbt`创建一个Scala项目，`sbt scala/scala3.g8`
然后进入项目文件夹
修改`build.sbt`，将`build.sbt`修改为以下内容
```sbt
ThisBuild / scalaVersion     := "2.12.13"
ThisBuild / version          := "0.1.0"
ThisBuild / organization     := "%ORGANIZATION%"

lazy val root = (project in file("."))
  .settings(
    name := "%NAME%",
    libraryDependencies ++= Seq(
      "edu.berkeley.cs" %% "chisel3" % "3.4.3",
      "edu.berkeley.cs" %% "chiseltest" % "0.3.3" % "test",
      "edu.berkeley.cs" %% "rocketchip" % "1.2.6",
      "edu.berkeley.cs" %% "chisel-iotesters" % "1.5.+"
    ),
    scalacOptions ++= Seq(
      "-Xsource:2.11",
      "-language:reflectiveCalls",
      "-deprecation",
      "-feature",
      "-Xcheckinit",
      "-P:chiselplugin:useBundlePlugin"
    ),
    addCompilerPlugin("edu.berkeley.cs" % "chisel3-plugin" % "3.4.3" cross CrossVersion.full),
    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full)
  )
```
然后创建一个`src/main/scala/QueueTest/QueueTest.scala`文件，里面填入以下内容
```scala
package QueueTest

import chisel3._
import chisel3.util._

class QueueTest extends Module {
  val io = IO(new Bundle {
    val in = Flipped(Decoupled(UInt(8.W)))
    val out = Decoupled(UInt(8.W))
  })
  val queue = Queue(io.in,2)    //创建一个Queue
  io.out <> queue
}
```
再创建一个`src/main/scala/QueueTest/QueueTestSpec.scala`文件，里面填入以下内容
```scala
package QueueTest
 
import chisel3._
import chisel3.util._
import chisel3.tester._
import chisel3.tester.RawTester.test
import org.scalatest.FreeSpec

object testMain extends App {
    test(new QueueTest) { c =>
      c.io.out.ready.poke(false.B)
      c.io.in.valid.poke(true.B)  // Enqueue an element
      c.io.in.bits.poke(42.U)
      println(s"Starting:")
      println(s"\tio.in: ready=${c.io.in.ready.peek().litValue}")
      println(s"\tio.out: valid=${c.io.out.valid.peek().litValue}, bits=${c.io.out.bits.peek().litValue}")
      c.clock.step(1)

    c.io.in.valid.poke(true.B)  // Enqueue another element
    c.io.in.bits.poke(43.U)
    // What do you think io.out.valid and io.out.bits will be?
    println(s"After first enqueue:")
    println(s"\tio.in: ready=${c.io.in.ready.peek().litValue}")
    println(s"\tio.out: valid=${c.io.out.valid.peek().litValue}, bits=${c.io.out.bits.peek().litValue}")
    c.clock.step(1)

    c.io.in.valid.poke(true.B)  // Read a element, attempt to enqueue
    c.io.in.bits.poke(44.U)
    c.io.out.ready.poke(true.B)
    // What do you think io.in.ready will be, and will this enqueue succeed, and what will be read?
    println(s"On first read:")
    println(s"\tio.in: ready=${c.io.in.ready.peek()}")
    println(s"\tio.out: valid=${c.io.out.valid.peek()}, bits=${c.io.out.bits.peek()}")
    c.clock.step(1)

    c.io.in.valid.poke(false.B)  // Read elements out
    c.io.out.ready.poke(true.B)
    // What do you think will be read here?
    println(s"On second read:")
    println(s"\tio.in: ready=${c.io.in.ready.peek()}")
    println(s"\tio.out: valid=${c.io.out.valid.peek()}, bits=${c.io.out.bits.peek()}")
    c.clock.step(1)

    // Will a third read produce anything?
    println(s"On third read:")
    println(s"\tio.in: ready=${c.io.in.ready.peek()}")
    println(s"\tio.out: valid=${c.io.out.valid.peek()}, bits=${c.io.out.bits.peek()}")
    c.clock.step(1)
    }
  Driver.execute(args, () => new QueueTest)   //生成 .v文件
}
```
最后打开命令行，再命令行里如下以下代码，下面这行代码会在`generated/QueueTest`里生成`verilog`代码
```bash
sbt "test:runMain QueueTest.testMain --target-dir generated/QueueTest"
```
## 仿真结果
Starting:
        io.in: ready=1
        io.out: valid=0, bits=0
After first enqueue:
        io.in: ready=1
        io.out: valid=1, bits=42
On first read:
        io.in: ready=Bool(false)
        io.out: valid=Bool(true), bits=UInt<8>(42)
On second read:
        io.in: ready=Bool(true)
        io.out: valid=Bool(true), bits=UInt<8>(43)
On third read:
        io.in: ready=Bool(true)
        io.out: valid=Bool(false), bits=UInt<8>(42)
# 参考资料
[Interlude: Chisel Standard Library](https://github.com/freechipsproject/chisel-bootcamp/blob/master/3.2_interlude.ipynb)
[What does Flipped() do in Chisel3?](https://stackoverflow.com/questions/48343073/what-does-flipped-do-in-chisel3)