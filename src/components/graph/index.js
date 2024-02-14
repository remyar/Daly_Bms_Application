import React, { useState } from 'react';
import { injectIntl } from 'react-intl';

import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';

import ReactECharts from 'echarts-for-react';

function Graph(props) {

    let options = {};

    //if (props.id == undefined || props.id == "graph1") {
        options = {
            tooltip: {
                show: true,
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                show: false
            },
            xAxis: [{
                gridIndex: 0,
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#c1bdbd'
                    }
                },
                data : props.xAxis.data || []
            }, {
                gridIndex: 1,
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#c1bdbd'
                    }
                },
                data : props.xAxis.data || []
            }],
            yAxis: [{
                id: 0,
                gridIndex: 0,
                name: 'Volts',
                type: 'value',
                min: props.yAxis[0].min || 2.5,
                max: props.yAxis[0].max || 4.5,
                interval: 0.25,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#c1bdbd'
                    }
                },
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(2);
                    }
                }
            },
           /* {
                id: 1,
                gridIndex: 0,
                name: 'Bypass',
                type: 'value',
                min: 0,
                max: 100,
                interval: 10,
                position: 'right',
                axisLabel: { formatter: '{value}%' },
                splitLine: { show: false },
                axisLine: { lineStyle: { type: 'dotted', color: '#c1bdbd' } },
                axisTick: { show: false }
            },*/
            {
                id: 2,
                gridIndex: 1,
                name: 'Temperature',
                type: 'value',
                interval: 10,
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#c1bdbd'
                    }
                },
                axisLabel: {
                    formatter: '{value}°C'
                }
            }],
            series: [
                {
                    xAxisIndex: 0,
                    name: 'Voltage',
                    yAxisIndex: 0,
                    type: 'bar',
                    data: props.series[0]?.data || [],

                    markLine: {
                        silent: true,
                        symbol: 'none',

                        data: props.markLine || [],
                    },
                    itemStyle: { color: '#55a1ea', barBorderRadius: [8, 8, 0, 0] },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideBottom',
                            distance: 10,
                            align: 'left',
                            verticalAlign: 'middle',
                            rotate: 90,
                            formatter: '{c}V',
                            fontSize: 24,
                            color: '#eeeeee',
                            fontFamily: 'Fira Code'
                        }
                    }
                }, {
                    xAxisIndex: 0,
                    name: 'Min V',
                    yAxisIndex: 0,
                    type: 'line',
                    data:  props.series[1]?.data || [],
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            distance: 5,
                            formatter: '{c}V',
                            fontSize: 14,
                            color: '#eeeeee',
                            fontFamily: 'Fira Code'
                        }
                    },
                    symbolSize: 16,
                    symbol: ['circle'],
                    animation: false,
                    itemStyle: {
                        normal: {
                            color: "#c1bdbd",
                            lineStyle: {
                                color: 'transparent'
                            }
                        }
                    }
                }
                , {
                    xAxisIndex: 0,
                    name: 'Max V',
                    yAxisIndex: 0,
                    type: 'line',
                    data:  props.series[2]?.data || [],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            distance: 5,
                            formatter: '{c}V',
                            fontSize: 14,
                            color: '#c1bdbd',
                            fontFamily: 'Fira Code'
                        }
                    },
                    symbolSize: 16,
                    symbol: ['arrow'],
                    animation: false,
                    itemStyle: {
                        normal: {
                            color: "#c1bdbd",
                            lineStyle: {
                                color: 'transparent'
                            }
                        }
                    }
                }
                /*, {
                    xAxisIndex: 0,
                    name: 'Bypass',
                    yAxisIndex: 1,
                    type: 'line',
                    data:  props.series[3]?.data || [],
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            distance: 5,
                            formatter: '{c}%',
                            fontSize: 14,
                            color: '#f0e400',
                            fontFamily: 'Fira Code'
                        }
                    },
                    symbolSize: 16,
                    symbol: ['square'],
                    itemStyle: { normal: { color: "#f0e400", lineStyle: { color: 'transparent' } } }
                }

                , {
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    name: 'BypassTemperature',
                    type: 'bar',
                    data:  props.series[4]?.data || [],
                    itemStyle: {
                        color: '#55a1ea',
                        barBorderRadius: [8, 8, 0, 0]
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideBottom',
                            distance: 8,
                            align: 'left',
                            verticalAlign: 'middle',
                            rotate: 90,
                            formatter: '{c}°C',
                            fontSize: 20,
                            color: '#eeeeee',
                            fontFamily: 'Fira Code'
                        }
                    }
                }

                , {
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    name: 'CellTemperature',
                    type: 'bar',
                    data:  props.series[5]?.data || [],
                    itemStyle: {
                        color: '#55a1ea',
                        barBorderRadius: [8, 8, 0, 0]
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideBottom',
                            distance: 8,
                            align: 'left',
                            verticalAlign: 'middle',
                            rotate: 90,
                            formatter: '{c}°C',
                            fontSize: 20,
                            color: '#eeeeee',
                            fontFamily: 'Fira Code'
                        }
                    }

                }
                */
            ],
            grid: [
                {
                    containLabel: false,
                    left: '4%',
                    right: '4%',
                    bottom: '30%'

                }, {
                    containLabel: false,
                    left: '4%',
                    right: '4%',
                    top: '76%'
                }
            ]
        };
  //  }

    return <ReactECharts notMerge={false} id={props.id || "graph"} option={options} style={{ width: "100%", height: "100%" }} />
}

export default withStoreProvider(withNavigation(injectIntl(Graph)));