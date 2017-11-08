/**
 * Created by mingzhang on 11/7/17.
 */
'use strict';

function Scale(domain, range) {
  let ratio = (range[1] - range[0]) / (domain[1] - domain[0]);
  return function (x) {
    if (x < domain[0] || x > domain[1]) {
      throw new Error('Out of domain!');
    }
    return range[0] + ratio * (x - domain[0]);
  }
}

// let s = Scale([0, 10], [100, 0]);
// console.log(s(2));
// console.log(s(5));
// console.log(s(8));

function setDomain(arr) {

}

function plotA(data, svg, opts) {
  opts = opts || {};
  let margin = opts.margin || 20;
  let space = opts.space || 5; // space between axis and plot area
  let title = opts.title || '';
  let xAxisTitle = opts.xAxisTitle || '';
  let yAxisTitle = opts.yAxisTitle || '';
  let axisTitleSize = opts.axisTitleSize || 20;
  let dotSize = opts.dotSize || 4;

  let width = +(svg.getAttribute('width'));
  let height = +(svg.getAttribute('height'));
  let h = height - margin * 2;
  let w = width - margin * 2;

  if (h > w * 2) {
    h = w * 2;
  } else {
    w = h / 2;
  }

  let translate = {
    x: (width - w) / 2,
    y: (height - h) / 2
  };

  let domain = [0, 40];
  let yRange = [h, 0];

  let yScale = Scale(domain, yRange);

  let content = '';

  let xAxis = `<line id="xAxis" x1="0" y1="${h + space}" x2="w" y2="${h + space}"></line>`;
  let yAxis = `<line id="yAxis" x1="${-space}" y1="0" x2="${-space}" y2="h"></line>`;
  content += '<g id="axes"' +
    ' transform="translate(${translate.x},${translate.y})" stroke="black"' +
    ' stroke-width="3">' + xAxis + yAxis + '</g>';

  for (let i = 0; i < data.length; i++) {
    let p1 = {
      x: 0.25 * w,
      y: yScale(data[i].TPM1)
    };
    let p2 = {
      x: 0.75 * w,
      y: yScale(data[i].TPM2)
    };
    let dot1 = `<rect class="TPM1" x="${p1.x - dotSize}" y="${p1.y - dotSize}" width="${2 * dotSize}" height="${2 * dotSize}"></rect>`;
    let dots = `<circle class="TPM2" cx="${p2.x}" cy="${p2.y}" r="${dotSize}">`;
    let line = `<line class="connection-line" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"></line>`;
    content += '<g id="${data[i].gene_id}">' + line + dot1 + dot2 + '</g>';
  }

}

function plotB(data, ctx) {

}

if (typeof module !== 'undefined' && module.parent) {
  //module.exports =
} else {

} 