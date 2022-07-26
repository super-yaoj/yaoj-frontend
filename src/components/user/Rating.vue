<template>
<div style="width:100%" id="rating-container">
    <div id="rating-graph"></div>
    <table class="table table-hover text-center" v-if="ratings">
        <thead>
            <tr>
                <td><strong>Contest</strong></td>
                <td><strong>Time</strong></td>
                <td><strong>Rating</strong></td>
            </tr>
        </thead>
        <tbody>
            <template v-for="(item, index) in ratings" :key="index">
                <tr v-if="index + 1 < ratings.length">
                    <td><a :href="'#/contest/' + item.contest_id">#{{ item.contest_id }}. {{ item.title }}</a></td>
                    <td>{{ format(item.value[0]) }}</td>
                    <td>{{ item.value[1] }}(<span :style="'color:' + diffColor(item.diff)">{{ (item.diff > 0 ? '+' : '') + item.diff }}</span>)</td>
                </tr>
            </template>
        </tbody>
    </table>
</div>
</template>

<script>
import { callAPI } from '@/utils'
import * as echarts from 'echarts'
import { format } from 'silly-datetime'

var myChart = null
export default {
    props: ['register_time'],
    data() {
        return {
            id: this.$route.params.id,
            ratings: null,
            format,
        }
    },
    mounted() {
        myChart = echarts.init(document.getElementById("rating-graph"), null, {
            width: document.getElementById("rating-container").clientWidth,
            height: 400,
        })
        callAPI('ratings', 'get', {user_id: this.id}, (res) => {
            var data = [{rating: 0, contest_id: 0, time: this.register_time, title: ''}]
            if (res.data.ratings) data = data.concat(res.data.ratings)
            this.ratings = []
            for (var i in data) {
                this.ratings.push({
                    value: [data[i].time, data[i].rating],
                    contest_id: data[i].contest_id,
                    title: data[i].title,
                    diff: i == 0 ? 0 : data[i].rating - data[i - 1].rating,
                })
            }
            myChart.setOption(this.echartsOption(this.ratings))
            this.ratings = this.ratings.reverse()
            myChart.on('click', (params) => {
                if ('contest_id' in params.data && params.dataIndex > 0) {
                    this.$router.push('/contest/' + params.data.contest_id)
                }
            })
            window.addEventListener('resize', this.resizeHandler)
        }, (res) => {
            alert(res.data._error)
        })
    },
    beforeUnmount() {
        if (myChart) {
            window.removeEventListener('resize', this.resizeHandler)
            myChart.dispose()
            myChart = null
        }
    },
    methods: {
        resizeHandler() {
            myChart.resize({
                width: document.getElementById("rating-container").clientWidth,
                height: 400,
            })
        },
        diffColor(diff) {
            if (diff < 0) return 'red'
            if (diff > 0) return 'green'
            return 'gray'
        },
        echartsOption(data) {
            return {
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        var param = params[0], index = param.dataIndex
                        var ret = '<div style="font-size:.85rem">'
                        if (index == 0) {
                            ret += 'Register'
                        } else {
                            var color = this.diffColor(param.data.diff)
                            ret += param.data.title + ': ' + param.data.value[1] + '<span style="color:' + color + '">(' + (param.data.diff > 0 ? '+' : '') + param.data.diff + ')</span>'
                        }
                        return ret + '<br>' + format(param.data.value[0]) + '</div>'
                    }
                },
                grid: {
                    top: 10,
                    left: 10,
                    right: 50,
                },
                xAxis: {
                    type: 'time',
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    data: data,
                    type: 'line',
                    markLine: {
                        silent: true,
                        symbol: "none",
                        lineStyle: {
                            color: '#999'
                        },
                        label: {
                            color: '#999'
                        },
                        data: [
                            {
                                yAxis: 1200
                            },
                            {
                                yAxis: 1400
                            },
                            {
                                yAxis: 1600
                            },
                            {
                                yAxis: 1900
                            },
                            {
                                yAxis: 2100
                            },
                            {
                                yAxis: 2400
                            },
                            {
                                yAxis: 3000
                            }
                        ]
                    }
                }],
                visualMap: {
                    show: false,
                    top: 20,
                    left: 20,
                    pieces: [
                    {
                        lte: 1200,
                        color: 'gray'
                    },
                    {
                        gt: 1200,
                        lte: 1400,
                        color: 'green'
                    },
                    {
                        gt: 1400,
                        lte: 1600,
                        color: '#03A89E'
                    },
                    {
                        gt: 1600,
                        lte: 1900,
                        color: 'blue'
                    },
                    {
                        gt: 1900,
                        lte: 2100,
                        color: '#a0a'
                    },
                    {
                        gt: 2100,
                        lte: 2400,
                        color: '#FF8C00'
                    },
                    {
                        gt: 2400,
                        lte: 3000,
                        color: 'red'
                    },
                    {
                        gt: 3000,
                        color: '#a00'
                    }
                    ],
                },
            }
        }
    },
}
</script>