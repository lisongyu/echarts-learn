#echarts  学习之路
=================================

###学习思路
---
1. [初识echarts](#初识echarts)
2. [编写自己的echarts图表](#编写自己的echarts图表)
3. [编写工作中需求的echarts图表](#编写工作中需求的echarts图表)

---
####初识echarts

####[echarts官方文档](http://echarts.baidu.com/)

1. [实例](http://echarts.baidu.com/doc/example.html)
	1.	[入门教程](http://echarts.baidu.com/doc/start.html)
	2.	主要实例分析（折线为主，柱状次之，其他辅助）
	3.	[主题学习](http://echarts.baidu.com/doc/example/themeDesigner.html)
	
2. [文档](http://echarts.baidu.com/doc/doc.html)
	1. 简介
	2. 名词解释
	3. 图表类型
	4. 引入ECharts
	5. 自定义构建echarts单文件
	6. 初始化
	7. 实例方法
	8. 选项
	9. 图数据表示
	10. 多级控制设计
	
3. 知识点总结
######添加多条 图例多条数据
``` javascript
/**
* 添加多个图例，多条数据便可实现
*/
 legend: {
   data:['进口量','出口量']//多条数据
         }
  {
   "name":"进口量",
   "type":"bar",
   "data":[5, 20, 40, 10, 10, 20]//X轴对应的数值
    },
    {
   "name":"出口量",
    "type":"bar",
   "data":[50, 120, 10, 70, 40, 62]
                        }
```
参考页面 [morelegend.html](https://github.com/lisongyu/echarts-learn)
######添加平均值，最大值最小值

``` javascript
/**
* 添加平均值，最大值最小值
*/
//最大值与最小值
  markPoint : {
  data : [
     {type : 'max', name: '最大值'},
     {type : 'min', name: '最小值'}
         ]
      },
//平均值
     markLine : {
     data : [
     {type : 'average', name: '平均值'}
            ]
     }
```
参考页面 [average.html](https://github.com/lisongyu/echarts-learn)

######折线与柱状图混合

``` javascript
/**
* 折线与柱状图混合
*/
 yAxis : [
 {
type : 'value'
  },
   //第二个纵轴坐标
   {
    type : 'value',
    name:'%'
   }
   ],
   //设置数据
   series : [
   {
  "name":"今年国内生产总值",
  "type":"bar",
  "data":[5, 20, 40, 10, 10, 20]//X轴对应的数值
},
   {
   "name":"去年比例",
   "type":"line",
    //结合
    yAxisIndex: 1,//Y轴第二坐标的索引
    "data":[50, 80, 10, 70, 40, 62]//X轴对应的数值
    }
	    ]
```
参考页面 [linebar.html](https://github.com/lisongyu/echarts-learn)

######响应式
``` javascript
/**
* 需结合jquery
*/
$(window).resize(function () {
 myChart.resize(option);
  });
```


---
####编写自己的echarts图表

要制作属于自己的图表首先一点就要应用到Ajax技术，因为每个图表中都有数据，而利用Ajax可以将数据与表现想分离，使工作进行模块化，便于协作开发。

根据option可知有三项数据可变分别如下
```javascript
 legend: { data:['销量,产量']},
  xAxis : [{type : 'category',//种类
  data : ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]],
  series : [{
         "name":"销量",
          "type":"bar",
          "data":[5, 20, 40, 10, 10, 20]
          }，
		  {
         "name":"产量",
          "type":"bar",
          "data":[5, 80, 50, 20, 10, 20]
          }
]
```

所涉及的知识点
1. [Ajax技术](http://api.jquery.com/jQuery.ajax/)（可以去官网了解）
2.   [Json数据格式](http://www.json.org.cn/)
3.  eval()如何使用
4.  each()如何使用

#####eval()如何使用？
1.了解eval()方法 参考 [eval()基础使用](http://www.w3school.com.cn/jsref/jsref_eval.asp)。
2.[使用eval()来解析数据](http://www.cnblogs.com/myjavawork/archive/2011/03/10/1979279.html)。

#####each()如何使用？ 请参考  [each()方法的使用](http://api.jquery.com/each/)

了解上述知识点开始实现一个自己的图表

1.一组json数据
```json
{
"name":["销量","产量"],
"data":[
        [5, 20, 40, 10, 10, 20],
        [50, 80, 20, 15, 20, 24]
        ],
"xlist":["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
}
```
2.运用Ajax获取数据。
```javascript
var sql='json/data.json';
      var request = $.ajax({
          url: sql,
          type: "get",
		  dataType:"json",
          cache: false
          });
     request.done(function(data) {
          //获取数据后续操作
     });
```
3.将数据与配置项相结合
```javascript
var series = eval(data);
//配置的名字等于由ajax获取的名字，坐标为获取的坐标
config.legend.data=series.name;
config.xAxis[0].data=series.xlist;
//设置数据
//根据每一个图例生成各组数据(思想即一个图例的索引对应相应数据的索引)                   

$(series.name).each(function(index,value){
    var everyData=series.data[index];
    config.series.push(template(value,everyData));});
//生成图表
myChart.setOption(config);
```
参考页面 [ajacecharts.html](https://github.com/lisongyu/echarts-learn)

---
####编写工作中需求的echarts图表

大家已经能够用ajax生成图表，但考虑到大量图表的问题，这就迫使我们不得不对其进行规划。
#####整体结构的规划
1.将javascript从html中剔除，在body中添加data-chart属性。
2.根据不同的data-chart值加载不同的javascript代码。
```javascript
require.config({
    paths: {
    echarts: 'echarts-2.1.8/build/dist',
    jquery:'js/jquery-1.7.2.min'
    }
    //用paths来映射配置项echarts-2.1.8/build/dist 用echarts代替
    });
//获取body标签
var bodyElem = document.getElementsByTagName("body")[0];
//获取bodyElem属性data-chart的值
var chartName = bodyElem.getAttribute('data-chart');
//根据不同的值加载不同的javascript
require(['js/'+chartName]);
```
3.根据data-chart值命名javascript页面。

参考页面  [ajax.html](https://github.com/lisongyu/echarts-learn)

#####根据不同需求设计不同方法在data-chart值的对应的javascript页面进行调用，根据时间和选择内容的多少主要分为以下4大需求。
 
 简要介绍以下几个专属名词
  1.时间段（1997-2012）
  2.时间点（1997）
  3.单选（选择单一项，如复选框中只选择一个选项）
  4.多选（选择多项，如复选框中选择多个选项）

#####思路分析：
   用插件的方式封装方法进行调用。

	  	

