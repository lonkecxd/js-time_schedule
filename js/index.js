"use strict";

var data = d3.range(1, 8);
var catas = ["睡觉", "吃饭", "做专案", "散步", "读书", "跑步"];
function gen_data() {
  var last = null;
  return d3.range(0, 24).map(function (o) {

    last = catas[parseInt(Math.random() * catas.length)];
    return {
      time: o,
      thing: last

    };
  });
}
var raw_data = gen_data();
var newdata = raw_data.map(function (o) {
  return o.thing;
}).filter(function (d, i, arr) {
  return arr.indexOf(d) == i;
});
function merged(arr) {
  var joined_data = arr.reduce(function (all, el) {
    var last_el = all.slice(-1)[0];
    var last_thing = last_el ? last_el.thing : null;
    if (last_thing == el.thing) {
      last_el.end_hour = el.time;
      return all;
    } else {
      return all.concat({ thing: el.thing, start_hour: el.time, end_hour: el.time });
    }
  }, []);
  return joined_data;
}

var data_week = d3.range(0, 7).map(function () {
  return merged(gen_data());
});
var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 700);

var hour_height = 30;
var day_width = 80;
var colorize2 = d3.scaleLinear().domain([0, 3]).range(["white", "red"]);
var colorize = d3.scaleOrdinal().range(d3.schemeCategory20c);

var group = svg.selectAll("g").data(data_week).enter().append("g").attr("transform", function (d, i) {
  return "translate(" + i * 100 + ")";
});

var hour_rect = group.selectAll("rect.hour").data(function (d) {
  return d;
}).enter().append("rect").attr("class", "hour").attr("y", function (d, i) {
  return d.start_hour * hour_height;
}).attr("width", day_width).attr("height", function (d) {
  return (d.end_hour - d.start_hour + 1) * hour_height;
}).attr("stroke", "black").attr("fill", function (d, i) {
  return colorize(newdata.indexOf(d.thing));
});

var hour_text = group.selectAll("text.hour").data(function (o) {
  return o;
}).enter().append("text").attr("class", "hour").attr("y", function (d, i) {
  return d.start_hour * hour_height + 15;
}).attr("fill", "black").text(function (d) {
  return d.thing;
});