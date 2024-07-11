// import React, { Component } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import axios from 'axios';
// import { SMA, BollingerBands } from 'technicalindicators';

// class ApexChart extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             series: [
//                 { name: 'Candlestick', type: 'candlestick', data: [] },
//                 { name: 'SMA', type: 'candelstick', data: [] },
//                 { name: 'Bollinger Bands', type: 'line', data: [] }
//             ],
//             options: {
//                 chart: {
//                     type: 'candlestick',
//                     height: 350,
//                     zoom: {
//                         enabled: true,
//                         type: 'x',
//                         autoScaleYaxis: true
//                     },
//                     toolbar: {
//                         tools: {
//                             zoom: true,
//                             zoomin: true,
//                             zoomout: true,
//                             pan: true,
//                             reset: true
//                         }
//                     }
//                 },
//                 xaxis: {
//                     type: 'datetime',
//                     labels: {
//                         datetimeUTC: false
//                     }
//                 },
//                 yaxis: {
//                     labels: {
//                         formatter: function (value) {
//                             return value.toFixed(2);
//                         }
//                     },
//                     tooltip: {
//                         enabled: true
//                     }
//                 },
//                 tooltip: {
//                     y: {
//                         formatter: function (value) {
//                             return value.toFixed(2);
//                         }
//                     }
//                 }
//             }
//         };
//     }

//     componentDidMount() {
//         this.fetchData();
//     }

//     componentDidUpdate(prevProps) {
//         if (prevProps.interval !== this.props.interval) {
//             this.fetchData();
//         }
//     }

//     fetchData() {
//         const { interval } = this.props;

//         axios.get(`http://192.168.1.2:8081/stock/candle?instrumentKey=NSE_EQ%7CINE552Z01027&interval=${interval}`)
//             .then(response => {
//                 const formattedData = response.data.map(item => ({
//                     x: new Date(item[0]),
//                     y: [item[1], item[2], item[3], item[4]]
//                 }));

//                 const closePrices = response.data.map(item => item[4]);

//                 // Calculate SMA
//                 const sma = SMA.calculate({ period: 14, values: closePrices });
//                 const smaData = formattedData.slice(13).map((item, index) => ({
//                     x: item.x,
//                     y: sma[index]
//                 }));

//                 // Calculate Bollinger Bands
//                 const bb = BollingerBands.calculate({ period: 20, values: closePrices, stdDev: 2 });
//                 const upperBand = bb.map(item => item.upper);
//                 const lowerBand = bb.map(item => item.lower);
//                 const middleBand = bb.map(item => item.middle);

//                 const upperBandData = formattedData.slice(19).map((item, index) => ({
//                     x: item.x,
//                     y: upperBand[index]
//                 }));

//                  const lowerBandData = formattedData.slice(19).map((item, index) => ({
//                     x: item.x,
//                     y: lowerBand[index]
//                 }));

//                 const middleBandData = formattedData.slice(19).map((item, index) => ({
//                     x: item.x,
//                     y: middleBand[index]
//                 }));

//                 this.setState({
//                     series: [
//                         { name: 'Candlestick', type: 'candlestick', data: formattedData },
//                         { name: 'SMA', type: 'line', data: smaData },
//                         { name: 'Bollinger Upper Band', type: 'line', data: upperBandData },
//                         { name: 'Bollinger Lower Band', type: 'line', data: lowerBandData },
//                         { name: 'Bollinger Middle Band', type: 'line', data: middleBandData }
//                     ]
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching data', error);
//             });
//     }

//     render() {
//         return (
//             <div>
//                 <div id="chart">
//                     <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={850} />
//                 </div>
//                 <div id="html-dist"></div>
//             </div>
//         );
//     }
// }

// export default ApexChart;

import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { SMA, BollingerBands } from "technicalindicators";

class ApexChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{ name: "Candlestick", type: "candlestick", data: [] }],
      options: {
        chart: {
          type: "candlestick",
          height: 350,
          zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: true,
          },
          toolbar: {
            tools: {
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
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
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.interval !== this.props.interval ||
      prevProps.indicator !== this.props.indicator
    ) {
      this.fetchData();
    }
  }

  fetchData() {
    const { interval, indicator } = this.props;

    axios
      .get(
        `http://localhost:8081/stock/candle?instrumentKey=NSE_EQ%7CINE065X01017&interval=${interval}`
        // `http://localhost:8081/stock/historicalCandle?instrumentKey=NSE_INDEX%7CNifty Bank&interval=${interval}&toDate=2024-01-01&fromDate=2024-01-01`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          x: new Date(item[0]),
          y: [item[1], item[2], item[3], item[4]],
        }));

        console.log('Formatted Data : ',formattedData);

        const closePrices = response.data.map((item) => item[4]);

        const existingSeries = this.state.series.filter(
          (series) => series.name !== "Candlestick"
        );

        let newSeries = [
          { name: "Candlestick", type: "candlestick", data: formattedData },
          ...existingSeries,
        ];

        if (indicator === "SMA") {
          const sma = SMA.calculate({ period: 14, values: closePrices });
          const smaData = formattedData.slice(13).map((item, index) => ({
            x: item.x,
            y: sma[index],
          }));
          console.log('sma : ' , sma);
          console.log('sma Data : ',smaData);
          newSeries = [
            ...newSeries.filter((series) => series.name !== "SMA"),
            { name: "SMA", type: "line", data: smaData },
          ];
        } else if (indicator.startsWith("Bollinger")) {
          const bb = BollingerBands.calculate({
            period: 20,
            values: closePrices,
            stdDev: 2,
          });
          const upperBand = bb.map((item) => item.upper);
          const lowerBand = bb.map((item) => item.lower);
          const middleBand = bb.map((item) => item.middle);

          if (indicator === "Bollinger Upper Band") {
            const upperBandData = formattedData
              .slice(19)
              .map((item, index) => ({
                x: item.x,
                y: upperBand[index],
              }));
            newSeries = [
              ...newSeries.filter(
                (series) => series.name !== "Bollinger Upper Band"
              ),
              {
                name: "Bollinger Upper Band",
                type: "line",
                data: upperBandData,
              },
            ];
          } else if (indicator === "Bollinger Lower Band") {
            const lowerBandData = formattedData
              .slice(19)
              .map((item, index) => ({
                x: item.x,
                y: lowerBand[index],
              }));
            newSeries = [
              ...newSeries.filter(
                (series) => series.name !== "Bollinger Lower Band"
              ),
              {
                name: "Bollinger Lower Band",
                type: "line",
                data: lowerBandData,
              },
            ];
          } else if (indicator === "Bollinger Middle Band") {
            const middleBandData = formattedData
              .slice(19)
              .map((item, index) => ({
                x: item.x,
                y: middleBand[index],
              }));
            newSeries = [
              ...newSeries.filter(
                (series) => series.name !== "Bollinger Middle Band"
              ),
              {
                name: "Bollinger Middle Band",
                type: "line",
                data: middleBandData,
              },
            ];
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
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="candlestick"
            height={800}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexChart;
