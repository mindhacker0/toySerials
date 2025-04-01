import { ref } from 'vue';
import { UUID } from '@/utils';
import * as echarts from 'echarts';
import throttle from 'lodash/throttle';
export const useRepoChart = ()=>{
    const idGithub = UUID();
    const idGitCode = UUID();
    const idCommit = UUID();
    const commitData = ref<any[]>([]);
    const githubData = ref<any[]>([]);
    const gitcodeData = ref<any[]>([]);
    const chartInstance = ref<any>([]);
    const initGithub = ()=>{
        let myChart = echarts.init(document.getElementById(idGithub));
        // 绘制图表
        myChart.setOption({
            xAxis: {
                type: 'category',
                show:false,
                boundaryGap: false
            },
            yAxis: {
              type: 'value',
              show:false
            },
            tooltip:{
                trigger:'axis',
                renderMode:'richText',//微应用原因，渲染dom无法逃逸
                formatter: function (params) {
                    return `${params[0].value}`;
                }
            },
            grid:{left:0,bottom:0,top:0,right:0,height:100},
            series: [
                {
                    data:githubData.value,
                    type: 'line',
                    symbol:'none',
                    lineStyle:{color:"#2951E0"},
                    areaStyle: {color:new echarts.graphic.LinearGradient(0,0,0,1,[
                        {offset:0,color:'rgba(41, 81, 224, 0.12)'},
                        {offset:1,color:'rgba(41, 81, 224, 0.04)'}
                    ])}
                }
            ]
        });
        return myChart;
    }
    const initGitCode = ()=>{
        let myChart = echarts.init(document.getElementById(idGitCode));
        // 绘制图表
        myChart.setOption({
            xAxis: {
                type: 'category',
                show:false,
                boundaryGap: false
            },
            yAxis: {
              type: 'value',
              show:false
            },
            tooltip:{
                trigger:'axis',
                renderMode:'richText',//微应用原因，渲染dom无法逃逸
                formatter: function (params) {
                    return `${params[0].value}`
                }
            },
            grid:{left:0,bottom:0,top:0,right:0,height:100},
            series: [
                {
                    data: gitcodeData.value,
                    type: 'line',
                    symbol:'none',
                    lineStyle:{color:"#2951E0"},
                    areaStyle: {color:new echarts.graphic.LinearGradient(0,0,0,1,[
                        {offset:0,color:'rgba(41, 81, 224, 0.12)'},
                        {offset:1,color:'rgba(41, 81, 224, 0.04)'}
                    ])}
                }
            ]
        });
        return myChart;
    }
    const initCommit = ()=>{    
        let myChart = echarts.init(document.getElementById(idCommit));
        // 绘制图表
        myChart.setOption({
            xAxis: {
                type: 'category',
                show:false
            },
            yAxis: {
              type: 'value',
              show:false
            },
            tooltip:{
                trigger:'axis',
                renderMode:'richText',
                formatter: function (params) {
                    return `${params[0].name}\n${params[0].value}`
                }
            },
            grid:{left:0,bottom:0,top:0,right:0,height:100},
            series: [
                {
                    data:commitData.value,
                    type: 'line',
                    symbol:'none',
                    lineStyle:{color:"#2951E0"},
                    areaStyle: {color:new echarts.graphic.LinearGradient(0,0,0,1,[
                        {offset:0,color:'rgba(41, 81, 224, 0.12)'},
                        {offset:1,color:'rgba(41, 81, 224, 0.04)'}
                    ])}
                }
            ]
        });
        return myChart;
    }
    const resize = (ids:string[]):any[]=>{
        const rect:{w:number,h:number}[]= []
        ids.forEach((id:string) => {
            const elem = document.getElementById(id) as HTMLCanvasElement;
            if(elem){
                let pWidth = elem?.parentElement?.clientWidth||300;
                elem.width = pWidth;
                elem.height =100;
            }
            rect.push({w:elem.width,h:elem.height});
        });
        return rect;
    };
    const chartResize = throttle(()=>{//页面resize变化，表格重新渲染
        const rect = resize([idGithub,idGitCode,idCommit]);
        chartInstance.value.forEach((crt,index)=>crt?.resize({width:rect[index].w,height:rect[index].h}));
    },500);
    const chartInit = ()=>{//初始化
        resize([idGithub,idGitCode,idCommit]);
        chartInstance.value = [initGithub(),initGitCode(),initCommit()];
        window.addEventListener('resize',chartResize);
        return ()=>{
            window.removeEventListener('resize',chartResize);
        }
    }
    return {
        idGithub,
        idGitCode,
        idCommit,
        commitData,
        githubData,
        gitcodeData,
        chartInit
    }
}