import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { SMA, BollingerBands } from "technicalindicators";
import DatePickerComponent from './component/datePicker/index';
import VolumeChart from "./VolumeChart";

const ApexChart = (props) => {
  const [series, setSeries] = useState([{ name: "Candlestick", type: "candlestick", data: [] }]);
  const [volumeData, setVolumeData] = useState([]);
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
        // const volumes = response.data.map((item) => item[5]);
        const volumes = response.data.map((item) => ({
          x: new Date(item[0]),
          y: item[5],
        }));

        setVolumeData(volumes); // Set volume data

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

            // if (indicators.includes("24-hour volume")) {
            //   console.log("Volume data:", volumes);
            //   newSeries.push({
            //     name: "24-Hour Volume",
            //     type: "column",
            //     data: volumes,
            //   });
            // }
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
    if (toDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && fromDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      if (interval === "1minute") {
        const intervalId = setInterval(() => {
          // alert("Refresh in every 1 minute")
          fetchData();
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(intervalId);
      } else {
        const intervalId = setInterval(() => {
          // alert("Refresh in every 30 minute")
          fetchData();
        }, 1800000); // 1800000 ms = 30 minutes

        return () => clearInterval(intervalId);
      }
    }
  }, [fetchData, fromDate, toDate, interval]);

  const ohlcColor = ohlc.isGreenCandle ? "#098E09" : "#FF0000";

  const [options, setOptions] = useState({
    chart: {
      type: "candlestick",
      height: 400,
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "pan" // Default tool selected on chart load
      },
      //   animations: {
      //     enabled: true,       // Enable or disable animations
      //     easing: "easeinout", // Type of easing for animations
      //     speed: 800,          // Speed of the animation in milliseconds
      //     animateGradually: {
      //         enabled: true,
      //         delay: 150       // Delay between each data point animation in milliseconds
      //     },
      //     dynamicAnimation: {
      //         enabled: true,
      //         speed: 350        // Speed of dynamic animations in milliseconds
      //     }
      // },
      background: "#ffffff",   // Background color of the chart
      foreColor: "#333",       // Default text color for the chart
      dropShadow: {
        enabled: false,      // Add drop shadow to chart elements
        top: 2,
        left: 2,
        blur: 2,
        opacity: 0.2
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        format: 'hh-mm TT',    // Customize the date format displayed on the x-axis
        rotate: -45,
        style: {
          colors: "#333",  // Color of the labels
          fontSize: "12px", // Font size of the labels
          fontFamily: "Arial, sans-serif",
        },
        offsetX: 0,           // Horizontal offset for labels
        offsetY: 0,           // Vertical offset for labels
      },
      // range: 3600000, // Set default range to 1 hour in milliseconds
      // scrollbar: {
      //   enabled: true,
      //   height: 20,
      //   offsetX: 0,
      //   offsetY: 0,
      //   barHeight: 10,
      //   trackHeight: 10,
      //   handleHeight: 15,
      // },
      title: {
        text: "Date & Time",         // Title of the x-axis
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#333",    // Color of the title text
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
        }
      },
      // tickAmount: 6,            // Number of ticks on the x-axis
      crosshairs: {
        show: true,           // Display crosshairs for better data alignment
        width: 1,
        position: 'back',
        opacity: 0.9,
        stroke: {
          color: '#333',
          width: 1,
          dashArray: 0
        },
      },
      axisBorder: {
        show: true,
        color: '#333',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#333',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
      tooltip: {
        enabled: true,
      },
      range: series[0].data.length > 0
        ? (new Date(series[0].data[series[0].data.length - 1].x).getTime() -
          new Date(series[0].data[0].x).getTime()) * 1.1 // Increase range by 10%
        : undefined, // This condition handles an empty series
    },
    yaxis: {
      opposite: false, // Move y-axis to the right side
      labels: {
        formatter: function (value) {
          if (value >= 1e9) {
            return (value / 1e9).toFixed(1) + "B"; // Format as billion
          } else if (value >= 1e6) {
            return (value / 1e6).toFixed(1) + "M"; // Format as million
          } else if (value >= 1e3) {
            return (value / 1e3).toFixed(1) + "K"; // Format as thousand
          } else {
            return value.toFixed(2); // Display the original number if it's small
          }
        },
        style: {
          colors: "#333",
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
        },
        offsetX: 0,
        offsetY: 0,
      },
      forceNiceScale: true,       // Ensures evenly distributed ticks
      crosshairs: {
        show: true,
        width: 1,
        position: 'back',
        opacity: 0.9,
        stroke: {
          color: '#333',
          width: 1,
          dashArray: 0
        },
      },
      axisBorder: {
        show: true,
        color: '#333',
        offsetX: -7,
        offsetY: -7
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#333',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
      tooltip: {
        enabled: true,
      }
    },
    tooltip: {
      enabled: true, // Enable or disable the tooltip
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        // Get the OHLC values
        const open = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const high = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const low = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const close = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const isGreenCandle = close > open;

        // Calculate change and percentage change
        const change = (close - open).toFixed(2);
        const percentChange = ((change / open) * 100).toFixed(2);

        setOhlc({
          open: open,
          high: high,
          low: low,
          close: close,
          isGreenCandle: isGreenCandle,
          change: change,
          percentChange: percentChange,
        });

        // Return the custom tooltip content
        return `
          <div class="apexcharts-tooltip-candlestick">
            <span class="apexcharts-tooltip-span-candlestick">Open: ${open.toFixed(2)}</span><br><br>
            <span class="apexcharts-tooltip-span-candlestick">High: ${high.toFixed(2)}</span><br><br>
            <span class="apexcharts-tooltip-span-candlestick">Low: ${low.toFixed(2)}</span><br><br>
            <span class="apexcharts-tooltip-span-candlestick">Close: ${close.toFixed(2)}</span><br><br>
            <span class="apexcharts-tooltip-span-candlestick">Change: ${change}
            (${percentChange}%)</span><br>
          </div>
        `;
      },
      shared: true,  // Display tooltip for all series at the hovered x-axis value
      followCursor: true, // Makes tooltip follow the cursor as it moves
      theme: "dark", // Set the theme of the tooltip (light, dark)
      style: {
        fontSize: "12px", // Font size of the tooltip
        fontFamily: "Arial, sans-serif", // Font family of the tooltip
      },
      fillSeriesColor: true, // Use the series color in the tooltip
      onDatasetHover: {
        highlightDataSeries: true, // Highlight the series when hovering over a dataset
      },
      x: {
        show: true,
        format: "dd MMM hh:mm TT", // Date format if x-axis is datetime
        // formatter: function (value) {
        //   return new Date(value).toLocaleDateString(); // Custom format for x-axis value
        // },
      },
    },
    legend: {
      show: false,
    },
  });

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

      <div id="chart ohlc-header">
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={742}
        />
      </div>

      {/* <VolumeChart volumeData={volumeData} /> Render VolumeChart component below the candlestick chart */}
    </div>
  );
};

export default ApexChart;
