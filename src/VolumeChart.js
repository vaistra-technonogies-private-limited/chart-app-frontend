// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const VolumeChart = ({ volumeData }) => {
//     const options = {
//         chart: {
//             type: "bar",
//             height: 200,
//             zoom: {
//                 enabled: true,
//                 type: "x",
//                 autoScaleYaxis: true,
//             },
//             toolbar: {
//                 show: false,
//                 tools: {
//                     zoom: true,
//                     zoomin: true,
//                     zoomout: true,
//                     pan: true,
//                     reset: true,
//                 },
//                 autoSelected: "pan",
//             },
//             background: "#ffffff",
//             foreColor: "#333",
//         },
//         xaxis: {
//             type: "datetime",
//             labels: {
//                 datetimeUTC: false,
//                 format: "hh-mm TT",
//                 rotate: -45,
//                 style: {
//                     colors: "#333",
//                     fontSize: "12px",
//                     fontFamily: "Arial, sans-serif",
//                 },
//             },
//             //   title: {
//             //     text: "Date & Time",
//             //     style: {
//             //       color: "#333",
//             //       fontSize: "14px",
//             //       fontFamily: "Arial, sans-serif",
//             //     },
//             //   },
//         },
//         yaxis: {
//             labels: {
//                 formatter: (value) => {
//                     if (value >= 1e9) {
//                         return (value / 1e9).toFixed(1) + "B"; // Format as billion
//                     } else if (value >= 1e6) {
//                         return (value / 1e6).toFixed(1) + "M"; // Format as million
//                     } else if (value >= 1e3) {
//                         return (value / 1e3).toFixed(1) + "K"; // Format as thousand
//                     } else {
//                         return value.toFixed(2); // Display the original number if it's small
//                     }
//                 },
//                 style: {
//                     colors: "#333",
//                     fontSize: "11px",
//                     fontFamily: "Arial, sans-serif",
//                 },
//             },
//         },
//         tooltip: {
//             enabled: true,
//             theme: "dark",
//         },
//     };

//     const series = [
//         {
//             name: "Volume",
//             type: "bar",
//             data: volumeData,
//         },
//     ];

//     console.log(series)

//     return (
//         <div id="volume-chart">
//             <ReactApexChart options={options} series={series} type="bar" height={300}/>
//         </div>
//     );
// };

// export default VolumeChart;
