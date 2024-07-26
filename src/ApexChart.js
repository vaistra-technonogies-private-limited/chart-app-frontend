// // import React, { Component } from 'react';
// // import ReactApexChart from 'react-apexcharts';
// // import axios from 'axios';
// // import { SMA, BollingerBands } from 'technicalindicators';

// // class ApexChart extends Component {
// //     constructor(props) {
// //         super(props);

// //         this.state = {
// //             series: [
// //                 { name: 'Candlestick', type: 'candlestick', data: [] },
// //                 { name: 'SMA', type: 'candelstick', data: [] },
// //                 { name: 'Bollinger Bands', type: 'line', data: [] }
// //             ],
// //             options: {
// //                 chart: {
// //                     type: 'candlestick',
// //                     height: 350,
// //                     zoom: {
// //                         enabled: true,
// //                         type: 'x',
// //                         autoScaleYaxis: true
// //                     },
// //                     toolbar: {
// //                         tools: {
// //                             zoom: true,
// //                             zoomin: true,
// //                             zoomout: true,
// //                             pan: true,
// //                             reset: true
// //                         }
// //                     }
// //                 },
// //                 xaxis: {
// //                     type: 'datetime',
// //                     labels: {
// //                         datetimeUTC: false
// //                     }
// //                 },
// //                 yaxis: {
// //                     labels: {
// //                         formatter: function (value) {
// //                             return value.toFixed(2);
// //                         }
// //                     },
// //                     tooltip: {
// //                         enabled: true
// //                     }
// //                 },
// //                 tooltip: {
// //                     y: {
// //                         formatter: function (value) {
// //                             return value.toFixed(2);
// //                         }
// //                     }
// //                 }
// //             }
// //         };
// //     }

// //     componentDidMount() {
// //         this.fetchData();
// //     }

// //     componentDidUpdate(prevProps) {
// //         if (prevProps.interval !== this.props.interval) {
// //             this.fetchData();
// //         }
// //     }

// //     fetchData() {
// //         const { interval } = this.props;

// //         axios.get(`http://192.168.1.2:8081/stock/candle?instrumentKey=NSE_EQ%7CINE552Z01027&interval=${interval}`)
// //             .then(response => {
// //                 const formattedData = response.data.map(item => ({
// //                     x: new Date(item[0]),
// //                     y: [item[1], item[2], item[3], item[4]]
// //                 }));

// //                 const closePrices = response.data.map(item => item[4]);

// //                 // Calculate SMA
// //                 const sma = SMA.calculate({ period: 14, values: closePrices });
// //                 const smaData = formattedData.slice(13).map((item, index) => ({
// //                     x: item.x,
// //                     y: sma[index]
// //                 }));

// //                 // Calculate Bollinger Bands
// //                 const bb = BollingerBands.calculate({ period: 20, values: closePrices, stdDev: 2 });
// //                 const upperBand = bb.map(item => item.upper);
// //                 const lowerBand = bb.map(item => item.lower);
// //                 const middleBand = bb.map(item => item.middle);

// //                 const upperBandData = formattedData.slice(19).map((item, index) => ({
// //                     x: item.x,
// //                     y: upperBand[index]
// //                 }));

// //                  const lowerBandData = formattedData.slice(19).map((item, index) => ({
// //                     x: item.x,
// //                     y: lowerBand[index]
// //                 }));

// //                 const middleBandData = formattedData.slice(19).map((item, index) => ({
// //                     x: item.x,
// //                     y: middleBand[index]
// //                 }));

// //                 this.setState({
// //                     series: [
// //                         { name: 'Candlestick', type: 'candlestick', data: formattedData },
// //                         { name: 'SMA', type: 'line', data: smaData },
// //                         { name: 'Bollinger Upper Band', type: 'line', data: upperBandData },
// //                         { name: 'Bollinger Lower Band', type: 'line', data: lowerBandData },
// //                         { name: 'Bollinger Middle Band', type: 'line', data: middleBandData }
// //                     ]
// //                 });
// //             })
// //             .catch(error => {
// //                 console.error('Error fetching data', error);
// //             });
// //     }

// //     render() {
// //         return (
// //             <div>
// //                 <div id="chart">
// //                     <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={850} />
// //                 </div>
// //                 <div id="html-dist"></div>
// //             </div>
// //         );
// //     }
// // }

// // export default ApexChart;

// import React, { Component } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";
// import { SMA, BollingerBands } from "technicalindicators";

// class ApexChart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       series: [{ name: "Candlestick", type: "candlestick", data: [] }],
//       options: {
//         chart: {
//           type: "candlestick",
//           height: 350,
//           zoom: {
//             enabled: true,
//             type: "x",
//             autoScaleYaxis: true,
//           },
//           toolbar: {
//             tools: {
//               zoom: true,
//               zoomin: true,
//               zoomout: true,
//               pan: true,
//               reset: true,
//             },
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           labels: {
//             datetimeUTC: false,
//           },
//         },
//         yaxis: {
//           labels: {
//             formatter: function (value) {
//               return value.toFixed(2);
//             },
//           },
//           tooltip: {
//             enabled: true,
//           },
//         },
//         tooltip: {
//           y: {
//             formatter: function (value) {
//               return value.toFixed(2);
//             },
//           },
//         },
//         legend: {
//           show: false,
//         },
//       },
//     };
//   }

//   componentDidMount() {
//     this.fetchData();
//   }

//   componentDidUpdate(prevProps) {
//     if (
//       prevProps.interval !== this.props.interval ||
//       prevProps.indicator !== this.props.indicator
//     ) {
//       this.fetchData();
//     }
//   }

//   fetchData() {
//     const { interval, indicator } = this.props;

//     axios
//       .get(
//         `http://localhost:8081/stock/candle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}`
//         // `http://localhost:8081/stock/historicalCandle?instrumentKey=NSE_INDEX%7CNifty Bank&interval=${interval}&toDate=2024-01-01&fromDate=2024-01-01`
//       )
//       .then((response) => {
//         const formattedData = response.data.map((item) => ({
//           x: new Date(item[0]),
//           y: [item[1], item[2], item[3], item[4]],
//         }));

//         console.log('Formatted Data : ',formattedData);

//         const closePrices = response.data.map((item) => item[4]);

//         const existingSeries = this.state.series.filter(
//           (series) => series.name !== "Candlestick"
//         );

//         let newSeries = [
//           { name: "Candlestick", type: "candlestick", data: formattedData },
//           ...existingSeries,
//         ];

//         if (indicator === "SMA") {
//           const sma = SMA.calculate({ period: 14, values: closePrices });
//           const smaData = formattedData.slice(13).map((item, index) => ({
//             x: item.x,
//             y: sma[index],
//           }));
//           console.log('sma : ' , sma);
//           console.log('sma Data : ',smaData);
//           newSeries = [
//             ...newSeries.filter((series) => series.name !== "SMA"),
//             { name: "SMA", type: "line", data: smaData },
//           ];
//         } else if (indicator.startsWith("Bollinger")) {
//           const bb = BollingerBands.calculate({
//             period: 20,
//             values: closePrices,
//             stdDev: 2,
//           });
//           const upperBand = bb.map((item) => item.upper);
//           const lowerBand = bb.map((item) => item.lower);
//           const middleBand = bb.map((item) => item.middle);

//           if (indicator === "Bollinger Upper Band") {
//             const upperBandData = formattedData
//               .slice(19)
//               .map((item, index) => ({
//                 x: item.x,
//                 y: upperBand[index],
//               }));
//             newSeries = [
//               ...newSeries.filter(
//                 (series) => series.name !== "Bollinger Upper Band"
//               ),
//               {
//                 name: "Bollinger Upper Band",
//                 type: "line",
//                 data: upperBandData,
//               },
//             ];
//           } else if (indicator === "Bollinger Lower Band") {
//             const lowerBandData = formattedData
//               .slice(19)
//               .map((item, index) => ({
//                 x: item.x,
//                 y: lowerBand[index],
//               }));
//             newSeries = [
//               ...newSeries.filter(
//                 (series) => series.name !== "Bollinger Lower Band"
//               ),
//               {
//                 name: "Bollinger Lower Band",
//                 type: "line",
//                 data: lowerBandData,
//               },
//             ];
//           } else if (indicator === "Bollinger Middle Band") {
//             const middleBandData = formattedData
//               .slice(19)
//               .map((item, index) => ({
//                 x: item.x,
//                 y: middleBand[index],
//               }));
//             newSeries = [
//               ...newSeries.filter(
//                 (series) => series.name !== "Bollinger Middle Band"
//               ),
//               {
//                 name: "Bollinger Middle Band",
//                 type: "line",
//                 data: middleBandData,
//               },
//             ];
//           }
//         }

//         this.setState({
//           series: newSeries,
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching data", error);
//       }); 
//   }

//   render() {
//     return (
//       <div>
//         <div id="chart">
//           <ReactApexChart
//             options={this.state.options}
//             series={this.state.series}
//             type="candlestick"
//             height={800}
//           />
//         </div>
//         <div id="html-dist"></div>
//       </div>
//     );
//   }
// }

// export default ApexChart;

// import React, { Component } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";
// import { SMA, BollingerBands } from "technicalindicators";

// class ApexChart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       series: [{ name: "Candlestick", type: "candlestick", data: [] }],
//       options: {
//         chart: {
//           type: "candlestick",
//           height: 350,
//           zoom: {
//             enabled: true,
//             type: "x",
//             autoScaleYaxis: true,
//           },
//           toolbar: {
//             tools: {
//               zoom: true,
//               zoomin: true,
//               zoomout: true,
//               pan: true,
//               reset: true,
//             },
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           labels: {
//             datetimeUTC: false,
//           },
//         },
//         yaxis: {
//           labels: {
//             formatter: function (value) {
//               return value.toFixed(2);
//             },
//           },
//           tooltip: {
//             enabled: true,
//           },
//         },
//         tooltip: {
//           y: {
//             formatter: function (value) {
//               return value.toFixed(2);
//             },
//           },
//         },
//         legend: {
//           show: false,
//         },
//       },
//     };
//   }

//   componentDidMount() {
//     this.fetchData();
//   }

//   componentDidUpdate(prevProps) {
//     if (
//       prevProps.interval !== this.props.interval ||
//       prevProps.indicators !== this.props.indicators
//     ) {
//       this.fetchData();
//     }
//   }

//   fetchData() {
//     const { interval, indicators } = this.props;

//     axios
//       .get(
//         `http://localhost:8081/stock/candle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}`
//         // `http://localhost:8081/stock/historicalCandle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}&toDate=2024-07-12&fromDate=2024-07-12`
//       )
//       .then((response) => {
//         const formattedData = response.data.map((item) => ({
//           x: new Date(item[0]),
//           y: [item[1], item[2], item[3], item[4]],
//         }));

//         const closePrices = response.data.map((item) => item[4]);

//         let newSeries = [
//           { name: "Candlestick", type: "candlestick", data: formattedData },
//         ];

//         if (indicators.includes("SMA")) {
//           const sma = SMA.calculate({ period: 14, values: closePrices });
//           const smaData = formattedData.slice(13).map((item, index) => ({
//             x: item.x,
//             y: sma[index],
//           }));
//           newSeries.push({ name: "SMA", type: "line", data: smaData });
//         }

//         if (indicators.includes("Bollinger Upper Band")) {
//           const bb = BollingerBands.calculate({
//             period: 20,
//             values: closePrices,
//             stdDev: 2,
//           });
//           const upperBand = bb.map((item) => item.upper);
//           const upperBandData = formattedData
//             .slice(19)
//             .map((item, index) => ({
//               x: item.x,
//               y: upperBand[index],
//             }));
//           newSeries.push({
//             name: "Bollinger Upper Band",
//             type: "line",
//             data: upperBandData,
//           });
//         }

//         if (indicators.includes("Bollinger Lower Band")) {
//           const bb = BollingerBands.calculate({
//             period: 20,
//             values: closePrices,
//             stdDev: 2,
//           });
//           const lowerBand = bb.map((item) => item.lower);
//           const lowerBandData = formattedData
//             .slice(19)
//             .map((item, index) => ({
//               x: item.x,
//               y: lowerBand[index],
//             }));
//           newSeries.push({
//             name: "Bollinger Lower Band",
//             type: "line",
//             data: lowerBandData,
//           });
//         }

//         if (indicators.includes("Bollinger Middle Band")) {
//           const bb = BollingerBands.calculate({
//             period: 20,
//             values: closePrices,
//             stdDev: 2,
//           });
//           const middleBand = bb.map((item) => item.middle);
//           const middleBandData = formattedData
//             .slice(19)
//             .map((item, index) => ({
//               x: item.x,
//               y: middleBand[index],
//             }));
//           newSeries.push({
//             name: "Bollinger Middle Band",
//             type: "line",
//             data: middleBandData,
//           });
//         }

//         this.setState({
//           series: newSeries,
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching data", error);
//       });
//   }

//   render() {
//     return (
//       <div>
//         <div id="chart">
//           <ReactApexChart
//             options={this.state.options}
//             series={this.state.series}
//             type="candlestick"
//             height={850}
//           />
//         </div>
//         <div id="html-dist"></div>
//       </div>
//     );
//   }
// }

// export default ApexChart;

import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { SMA, BollingerBands } from "technicalindicators";
import DatePickerComponent from './component/datePicker/index';

class ApexChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{ name: "Candlestick", type: "candlestick", data: [] }],
      options: {
        chart: {
          type: "candlestick",
          height: 300,
          zoom: {
            enabled: true,
            type: "xy",
            autoScaleYaxis: true,
          },
          toolbar: {
            tools: {
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
          events: {
            mouseMove: (event, chartContext, config) => {
              if (config.seriesIndex === 0 && config.dataPointIndex !== -1) {
                const dataPoint = this.state.series[0].data[config.dataPointIndex];
                const isGreenCandle = dataPoint.y[3] > dataPoint.y[0]; // Close > Open
                const change = dataPoint.y[3] - dataPoint.y[0];
                const percentChange = ((change / dataPoint.y[0]) * 100).toFixed(2);
                this.setState({
                  ohlc: {
                    open: dataPoint.y[0],
                    high: dataPoint.y[1],
                    low: dataPoint.y[2],
                    close: dataPoint.y[3],
                    isGreenCandle: isGreenCandle,
                    change: change.toFixed(2),
                    percentChange: percentChange,
                  },
                });
              }
            },
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
        },
        legend: {
          show: false,
        },
      },
      ohlc: {
        open: null,
        high: null,
        low: null,
        close: null,
        isGreenCandle: null,
        change: null,
        percentChange: null,
      },
      toDate: new Date(), // Initial values for toDate and fromDate
      fromDate: new Date(),
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.interval !== this.props.interval ||
      prevProps.indicators !== this.props.indicators ||
      prevState.toDate !== this.state.toDate ||
      prevState.fromDate !== this.state.fromDate
    ) {
      this.fetchData();
    }
  }

  handleChangeToDate = (date) => {
    this.setState({ toDate: date });
  };

  handleChangeFromDate = (date) => {
    this.setState({ fromDate: date });
  };

  fetchData() {
    const { interval, indicators } = this.props;
    const { toDate, fromDate } = this.state;

    const today = new Date().toISOString().split('T')[0];
    const isTodaySelected = toDate.toISOString().split('T')[0] === today && fromDate.toISOString().split('T')[0] === today;

    const url = isTodaySelected
      ? `http://localhost:8081/stock/candle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}`
      : `http://localhost:8081/stock/historicalCandle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}&toDate=${toDate.toISOString().split('T')[0]}&fromDate=${fromDate.toISOString().split('T')[0]}`;

    axios
      .get(url) // Ensure withCredentials is set to true
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          x: new Date(item[0]),
          y: [item[1], item[2], item[3], item[4]],
        }));

        const closePrices = response.data.map((item) => item[4]);

        console.log("Formatted Data:", formattedData);
        console.log("Close Prices:", closePrices);

        let newSeries = [
          { name: "Candlestick", type: "candlestick", data: formattedData },
        ];

        if (indicators.includes("SMA") && closePrices.length >= 14) {
          const sma = SMA.calculate({ period: 14, values: closePrices });
          const smaData = formattedData.slice(13).map((item, index) => ({
            x: item.x,
            y: sma[index],
          }));
          newSeries.push({ name: "SMA", type: "line", data: smaData });
        }

        if (indicators.includes("Bollinger Upper Band") || indicators.includes("Bollinger Lower Band") || indicators.includes("Bollinger Middle Band")) {
          if (closePrices.length >= 20) {
            const bb = BollingerBands.calculate({
              period: 20,
              values: closePrices,
              stdDev: 2,
            });
            const upperBand = bb.map((item) => item.upper);
            const lowerBand = bb.map((item) => item.lower);
            const middleBand = bb.map((item) => item.middle);

            if (indicators.includes("Bollinger Upper Band")) {
              const upperBandData = formattedData
                .slice(19)
                .map((item, index) => ({
                  x: item.x,
                  y: upperBand[index],
                }));
              newSeries.push({
                name: "Bollinger Upper Band",
                type: "line",
                data: upperBandData,
              });
            }

            if (indicators.includes("Bollinger Lower Band")) {
              const lowerBandData = formattedData
                .slice(19)
                .map((item, index) => ({
                  x: item.x,
                  y: lowerBand[index],
                }));
              newSeries.push({
                name: "Bollinger Lower Band",
                type: "line",
                data: lowerBandData,
              });
            }

            if (indicators.includes("Bollinger Middle Band")) {
              const middleBandData = formattedData
                .slice(19)
                .map((item, index) => ({
                  x: item.x,
                  y: middleBand[index],
                }));
              newSeries.push({
                name: "Bollinger Middle Band",
                type: "line",
                data: middleBandData,
              });
            }
          } else {
            console.warn("Not enough data points for Bollinger Bands");
          }
        }

        this.setState({
          series: newSeries,
        });
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }

  render() {
    const { ohlc, toDate, fromDate } = this.state;
    const ohlcColor = ohlc.isGreenCandle ? "#098E09" : "#FF0000";

    return (
      <div>
        <div id="ohlc-header">
          <div id="date-selectors">
            <span data-label="From Date:">
              <DatePickerComponent
                selectedDate={fromDate}
                handleChange={this.handleChangeFromDate}
              />
            </span>
            <span data-label="To Date:">
              <DatePickerComponent
                selectedDate={toDate}
                handleChange={this.handleChangeToDate}
              />
            </span>
          </div>

          {ohlc.open !== null && (
            <div id="ohlc-values" style={{ color: ohlcColor }}>
              <p style={{ color: ohlcColor }}>
                <span>Open: {ohlc.open.toFixed(2)}</span>
                <span style={{ paddingLeft: 10, paddingRight: 10 }}>
                  High: {ohlc.high.toFixed(2)}
                </span>
                <span style={{ paddingRight: 10 }}>Low: {ohlc.low.toFixed(2)}</span>
                <span style={{ paddingRight: 10 }}>Close: {ohlc.close.toFixed(2)}</span>
              </p>
              {ohlc.change !== null && (
                <div id="ohlc-change">
                  <span>
                    Change: {ohlc.change} ({ohlc.percentChange}%)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="candlestick"
            height={750}
          />
        </div>

        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexChart;

