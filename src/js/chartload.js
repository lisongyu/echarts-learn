/*
 * Created by songyu Li on 15/1/29.
 * */
// 路径配置
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

