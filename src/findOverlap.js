/**
 * Created by yangm11 on 11/6/2017.
 */
'use strict';

const fs = require('fs');
const readline = require('readline');

function findOverlap(path) {
  let ws = fs.createWriteStream(path + '.out');
  let res = {};
  let rl = readline.createInterface({
    input: fs.createReadStream(path)
  });
  let rows = 0;
  rl.on('line', line => {
    let elems = line.split('\t').filter(d => d.length);
    // console.log(elems);
    if (!res[elems[0]]) {
      res[elems[0]] = [{
        start: elems[1],
        stop: elems[2],
        geneID: elems[3],
        geneName: elems[4]
      }];
    } else {
      res[elems[0]].push({
        start: elems[1],
        stop: elems[2],
        geneID: elems[3],
        geneName: elems[4]
      });
    }
  }).on('close', () => {
    console.log(Object.keys(res).length);
    let chrs = Object.keys(res);
    // console.log(chrs);
    for (let i = 0; i < chrs.length; i++) {
      let a = res[chrs[i]];
      a.sort((p, q) => (+p.start) - (+q.start));
      // console.log(a);
      let obj = {};
      for (let j = 0; j < a.length; j++) {
        let gid = a[j].geneID;
        // console.log(gid);
        if (!obj[gid]) {
          obj[gid] = [[a[j].start, a[j].stop, a[j].geneName]];
        } else {
          let n = obj[gid].length;
          let g = obj[gid][n - 1];
          if (a[j].start >= g.start && a[j].stop >= g.stop && a[j].start < g.stop) {
            g.stop = a[j].stop;
          } else if (a[j].start > g.start && a[j].stop < g.stop) {

          } else {
            obj[a[j].geneID].push([a[j].start, a[j].stop, a[j].geneName]);
          }
        }
      }
      // console.log(obj);
      res[chrs[i]] = obj;
    }

    for (let i = 0; i < chrs.length; i++) {
      let chr = res[chrs[i]];
      // console.log(chr);
      let arr = [];
      let gs = Object.keys(chr);
      // console.log(gs);
      for (let j = 0; j < gs.length; j++) {
        // console.log(gs[j]);
        for (let k = 0; k < chr[gs[j]].length; k++) {
          // let row = chrs[i] + '\t' + chr[gs[j]][k][0] + '\t' + chr[gs[j]][k][1] + '\t' + gs[j] + '\n';
          // if (gs[j] === '473') {
          //   console.log(row);
          //   console.log(chrs[i]);
          //   console.log(chr[gs[j]][k][0]);
          //   console.log(chr[gs[j]][k][1]);
          // }
          let row = [chrs[i], chr[gs[j]][k][0], chr[gs[j]][k][1], chr[gs[j]][k][2], gs[j]];
          arr.push(row.join('\t') + '\n');
          // if (gs[j] === '473') {
          //   console.log(row);
          //   console.log(chrs[i]);
          //   console.log(chr[gs[j]][k][0]);
          //   console.log(chr[gs[j]][k][1]);
          // }
          rows += 1;
        }
      }
      ws.write(arr.join(''), () => {
        console.log(chrs[i] + ' has been written.');
        if (i === chrs.length - 1) {
          console.log('All done!');
          console.log(rows + ' line written.');
        }
      });
    }
  });
}

if (typeof module !== 'undefined' && module.parent) {

} else {
  // test code go here
  let p = process.argv[2];
  findOverlap(p);
}