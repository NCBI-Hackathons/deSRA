/**
 * Created by mingzhang on 11/7/17.
 */
'use strict';

function Scale(domain, range) {
  let ratio = (range[1] - range[0]) / (domain[1] - domain[0]);
  return function (x) {
    if (x < domain[0] || x > domain[1]) {
      console.log('Input is ', x);
      console.log('Domain is ', domain);
      x = x < domain[0] ? domain[0] : x;
      x = x > domain[1] ? domian[1] : x;
    }
    return range[0] + ratio * (x - domain[0]);
  }
}

// let s = Scale([0, 10], [100, 0]);
// console.log(s(2));
// console.log(s(5));
// console.log(s(8));

function setDomain(arr) {
  let min = +Infinity;
  let max = -Infinity;
  let a = [];
  for (let i = 0; i < arr.length; i++) {
    a.push(arr[i].TPM1);
    a.push(arr[i].TPM2);
  }
  for (let i = 0; i < a.length; i++) {
    if (min > a[i]) {
      min = a[i];
    }
    if (max < a[i]) {
      max = a[i];
    }
  }
  return [Math.floor(min), Math.ceil(max)];
}



function tagHouse(obj) {
  let res = '<' + obj.type;
  let props = Object.keys(obj);
  let children;
  for (let i = 0; i < props.length; i++) {
    if (props[i] === 'type') {
      continue;
    }
    if (props[i] === 'child') {
      children = obj.child;
      continue;
    }
    res += ' ' + props[i] + '=' + '"' + obj[props[i]] + '"';
  }
  res += '>';
  if (children) {
    for (let k = 0; k < children.length; k++) {
      res += tagHouse(obj);
    }
  }
  return res + '</' + obj.type + '>';
}

// console.log(tagHouse({
//   type: 'line',
//   id: 'test',
//   class: 'svg-line',
//   x1: 20,
//   y1: 20,
//   x2: 60,
//   y2: 60
// }));

function plotA(data, opts) {
  opts = opts || {};
  let margin = opts.margin || 50;
  let space = opts.space || 20; // space between axis and plot area
  let title = opts.title || '';
  let xAxisTitle = opts.xAxisTitle || '';
  let yAxisTitle = opts.yAxisTitle || '';
  let axisTitleSize = opts.axisTitleSize || 20;
  let dotSize = opts.dotSize || 8;
  let id = opts.id || 'svg-plot-generated';

  let width = opts.width || 700;
  let height = opts.height || 500;
  let h = height - margin * 2;
  let w = width - margin * 2;

  if (h > w * 1.5) {
    h = w * 1.5;
  } else {
    w = h / 2;
  }

  let translate = {
    x: (width - w) / 2,
    y: (height - h) / 2
  };

  // let domain = [0, 25];
  let domain = setDomain(data);
  let yRange = [h, 0];

  let yScale = Scale(domain, yRange);

  let content = '<svg id="' + id +'" width="' + width + '" height="' + height + '">';

  let xAxis = `<line id="xAxis" x1="0" y1="${h + space}" x2="${w}" y2="${h + space}"></line>`;
  let yAxis = `<line id="yAxis" x1="${-space}" y1="0" x2="${-space}" y2="${h}"></line>`;

  yAxis += `<text id="yAxisTitle" x="${0}" y="${0}" text-anchor="middle" stroke-width="0.5"
alignment-baseline="central" transform="translate(${-120} ${h/2}) rotate(270)">TPM (arbitrary units)</text>`;

  let ticks = '<g id="ticks" stroke-width="0.5" font-size="16">';

  for (let i = 0; i < 6; i++) {
    let d = Math.floor((domain[1] - domain[0]) / 5);
    // console.log(d);
    let py = yScale(d * i + domain[0]);
    let pText = d * i + domain[0];
    ticks += `<text x="${-space - 10}" y="${py}" text-anchor="end" alignment-baseline="hanging">${pText}</text>`;
  }
  ticks += `<text x="${0.25 * w}" y="${h + space + 20}" text-anchor="middle">N</text>`;
  ticks += `<text x="${0.75 * w}" y="${h + space + 20}" text-anchor="middle">T</text>`;
  ticks += '</g>';

  content += '<g id="axes"' +
    ` transform="translate(${translate.x},${translate.y})" stroke="black"` +
    ' stroke-width="3">' + xAxis + yAxis + ticks + '</g>';

  content += '<g id="plot-area"' +
    ` transform="translate(${translate.x},${translate.y})" stroke="black"` +
    ' stroke-width="2">';

  for (let i = 0; i < data.length; i++) {
    let p1 = {
      x: 0.25 * w,
      y: yScale(data[i].TPM1)
    };
    let p2 = {
      x: 0.75 * w,
      y: yScale(data[i].TPM2)
    };
    let dot1 = `<rect class="TPM1 marks" x="${p1.x - dotSize}" y="${p1.y - dotSize}" 
width="${2 * dotSize}" height="${2 * dotSize}" fill="transparent"></rect>`;
    let dot2 = `<circle class="TPM2 marks" cx="${p2.x}" cy="${p2.y}" r="${dotSize}" fill="transparent">`;
    let line = `<line class="connection-line" x1="${p1.x}" y1="${p1.y}" 
x2="${p2.x}" y2="${p2.y}" stroke-opacity="0"></line>`;
    content += `<g id="${data[i].gene_id}">` + line + dot1 + dot2 + '</g>';
  }

  let info = `<g id="info-area" stroke-width="0.5" font-size="14px">`;
  info += `<text id="gene-name-info" x="${w + 10}" y="${h / 2 - 40}"></text>`;
  info += `<text id="gene-id-info" x="${w + 10}" y="${h / 2 - 10}"></text>`;
  info += `<text id="TPM1-info" x="${w + 10}" y="${h / 2 + 20}"></text>`;
  info += `<text id="TPM2-info" x="${w + 10}" y="${h / 2 + 50}"></text>`;
  info += `<text id="PValue-info" x="${w + 10}" y="${h / 2 + 80}"></text>`;
  info += '</rect></g>';
  return content + info + '</svg>';
}

function plotB(data, ctx) {

}

function randColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgba(${r},${g},${b},0.8)`
}

function addDynamic(svg) {
  let marks = svg.getElementsByClassName('marks');
  for (let i = 0; i < marks.length; i++) {
    let mark = marks[i];
    let parentNode = mark.parentNode;
    let line = parentNode.firstChild;
    let peer = parentNode.lastChild === mark ? mark.previousSibling : parentNode.lastChild;
    let infoArea = document.getElementById('info-area');
    let gene_id = parentNode.getAttribute('id');
    // console.log(mark, line, peer);
    let datum = data.find(d => d.gene_id == gene_id);
    let geneName = document.getElementById('gene-name-info');
    let geneID = document.getElementById('gene-id-info');
    let tpm1 = document.getElementById('TPM1-info');
    let tpm2 = document.getElementById('TPM2-info');
    let pValue = document.getElementById('PValue-info');

    let color = randColor();

    mark.addEventListener('mouseover', function () {
      console.log('mouse over');
      mark.setAttribute('fill', color);
      line.setAttribute('stroke-opacity', 0.8);
      peer.setAttribute('fill', color);
      geneName.textContent = 'Gene name: ' + datum.name;
      geneID.textContent = 'Gene ID: ' + datum.gene_id;
      tpm1.textContent = 'TPM1: ' + datum.TPM1;
      tpm2.textContent = 'TPM2: ' + datum.TPM2;
      pValue.textContent = 'P-Value: ' + datum.PValue;
    });
    mark.addEventListener('mouseout', function () {
      console.log('mouse out');
      mark.setAttribute('fill', 'transparent');
      line.setAttribute('stroke-opacity', 0);
      peer.setAttribute('fill', 'transparent');
      geneName.textContent = '';
      geneID.textContent = '';
      tpm1.textContent = '';
      tpm2.textContent = '';
      pValue.textContent = '';
    });
  }
}

if (typeof module !== 'undefined' && module.parent) {
  //module.exports =
} else {

} 