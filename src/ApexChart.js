import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { SMA, BollingerBands } from "technicalindicators";
import DatePickerComponent from './component/datePicker/index';

const ApexChart = (props) => {
  const [series, setSeries] = useState([{ name: "Candlestick", type: "candlestick", data: [] }]);
  const [ohlc, setOhlc] = useState({
    open: null,
    high: null,
    low: null,
    close: null,
    isGreenCandle: null,
    change: null,
    percentChange: null,
  });
  const { interval, indicators, selectedSymbol, handleChangeFromDate, handleChangeToDate, toDate, fromDate } = props;

  const fetchData = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const isTodaySelected = toDate.toISOString().split('T')[0] === today && fromDate.toISOString().split('T')[0] === today;

    const url = isTodaySelected
      ? `http://localhost:8081/stock/candle?instrumentKey=${selectedSymbol['symbol']}&interval=${interval}`
      : `http://localhost:8081/stock/historicalCandle?instrumentKey=${selectedSymbol['symbol']}&interval=${interval}&toDate=${toDate.toISOString().split('T')[0]}&fromDate=${fromDate.toISOString().split('T')[0]}`;

    axios
      .get(url) // Ensure withCredentials is set to true
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          x: new Date(item[0]),
          y: [item[1], item[2], item[3], item[4]],
        }));

        const closePrices = response.data.map((item) => item[4]);

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

        setSeries(newSeries);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [interval, indicators, selectedSymbol, toDate, fromDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if(toDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && fromDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]){
      if(interval === "1minute"){
        const intervalId = setInterval(() => {
          // alert("Refresh in every 1 minute")
          fetchData();
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(intervalId);
      } else{
        const intervalId = setInterval(() => {
          // alert("Refresh in every 30 minute")
          fetchData();
        }, 1800000); // 1800000 ms = 30 minutes

        return () => clearInterval(intervalId);
      }
    }
  }, [fetchData,fromDate,toDate,interval]);

  // const handleMouseMove = (event) => {
  //   const chartRect = event.currentTarget.getBoundingClientRect();
  //   const x = event.clientX - chartRect.left;
  //   const chartWidth = chartRect.width;

  //   const dataPoints = series[0].data;
  //   const index = Math.floor((x / chartWidth) * dataPoints.length);

  //   if (index >= 0 && index < dataPoints.length) {
  //     const dataPoint = dataPoints[index];
  //     const isGreenCandle = dataPoint.y[3] > dataPoint.y[0];
  //     const change = dataPoint.y[3] - dataPoint.y[0];
  //     const percentChange = ((change / dataPoint.y[0]) * 100).toFixed(2);
  //     setOhlc({
  //       open: dataPoint.y[0],
  //       high: dataPoint.y[1],
  //       low: dataPoint.y[2],
  //       close: dataPoint.y[3],
  //       isGreenCandle: isGreenCandle,
  //       change: change.toFixed(2),
  //       percentChange: percentChange,
  //     });
  //   }
  // };

  // const handleMouseMove = (event) => {
  //   const chartRect = event.currentTarget.getBoundingClientRect();
  //   const x = event.clientX - chartRect.left;
  //   const chartWidth = chartRect.width;

  //   // Get data points from the first series
  //   const dataPoints = series[0].data;
  //   console.log(dataPoints)

  //   // Calculate index based on x-coordinate
  //   const index = Math.floor((x / chartWidth) * dataPoints.length);
  //   console.log(index);

  //   // Ensure index is within valid range
  //   if (index >= 0 && index < dataPoints.length) {
  //     const dataPoint = dataPoints[index];

  //     console.log(dataPoint)
  //     console.log(dataPoints[index])

  //     if (dataPoint && dataPoint.y) {
  //       const isGreenCandle = dataPoint.y[3] > dataPoint.y[0];
  //       const change = dataPoint.y[3] - dataPoint.y[0];
  //       const percentChange = ((change / dataPoint.y[0]) * 100).toFixed(2);
  //       setOhlc({
  //         open: dataPoint.y[0],
  //         high: dataPoint.y[1],
  //         low: dataPoint.y[2],
  //         close: dataPoint.y[3],
  //         isGreenCandle: isGreenCandle,
  //         change: change.toFixed(2),
  //         percentChange: percentChange,
  //       });
  //     }
  //   }
  // };

  // const getYAxisWidth = () => {
  //   const yAxisElement = document.querySelector('.apexcharts-yaxis'); // Adjust selector as needed
  //   if (yAxisElement) {
  //     return yAxisElement.getBoundingClientRect().width;
  //   }
  //   return 50; // Default to 0 if y-axis labels are not found
  // };

  // const handleMouseMove = (event) => {
  //   const chartRect = event.currentTarget.getBoundingClientRect();
  //   const initialX = event.clientX - chartRect.left;

  //   const yAxisWidth = getYAxisWidth();
  //   const x = initialX - yAxisWidth;

  //   const chartWidth = chartRect.width - yAxisWidth;

  //   const dataPoints = series[0].data;
  //   console.log("Total dataPoints", dataPoints.length)

  //   let index = Math.floor((x / chartWidth) * dataPoints.length);
  //   index = Math.max(0, Math.min(index, dataPoints.length - 1));
  //   // Calculate reversed index directly
  //   const reversedIndex = dataPoints.length - 1 - index;

  //   if (reversedIndex >= 0 && reversedIndex < dataPoints.length) {
  //     const dataPoint = dataPoints[reversedIndex-1];
  //     // Ensure dataPoint is an array and has at least 5 values
  //     // if (Array.isArray(dataPoint.data)) {
  //     //   const [open, high, low, close] = dataPoint;
  //     //   const isGreenCandle = close > open;
  //     //   const change = close - open;
  //     //   const percentChange = ((change / open) * 100).toFixed(2);

  //     //   setOhlc({
  //     //     open,
  //     //     high,
  //     //     low,
  //     //     close,
  //     //     isGreenCandle,
  //     //     change: change.toFixed(2),
  //     //     percentChange,
  //     //   });
  //     // } else {
  //     //   // console.log("Invalid dataPoint or dataPoint has insufficient length");
  //     // }
  //   }
  //    else {
  //     console.log("Reversed Index out of bounds");
  //   }
  // };

  const ohlcColor = ohlc.isGreenCandle ? "#098E09" : "#FF0000";

  const options = {
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
      opposite: false, // Move y-axis to the right side
      labels: {
        formatter: function (value) {
          return value.toFixed(2);
        },
      },
      tooltip: {
        enabled: false,
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
  };

  return (
    <div>
      <div id="ohlc-header">
        <div id="date-selectors">
          <span data-label="From Date:">
            <DatePickerComponent
              selectedDate={fromDate}
              handleChange={handleChangeFromDate}
            />
          </span>
          <span data-label="To Date:">
            <DatePickerComponent
              selectedDate={toDate}
              handleChange={handleChangeToDate}
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

      <div id="chart"
      // onMouseMove={handleMouseMove}
      >
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={750}
        />
      </div>

      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
