require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

var width = 1100;
var height = 200;

function buildLineChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 0, 1), new Date(2012, 11, 31)];

    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .stack(dateValueSumGroup, "Value Sum")
        .stack(dateFixedSumGroup, "Fixed", function () {
            return 10;
        })
        .width(width).height(height)
        .x(d3.time.scale().domain(xdomain))
        .transitionDuration(0)
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
        .xUnits(d3.time.days);
    chart.render();
    return chart;
}

function legend(chart) {
    return chart.select("g.dc-legend");
}

function legendItems(chart){
    return legend(chart).selectAll('g.dc-legend-item')
}

suite.addBatch({
    'line chart legend': {
        topic: function () {
            return buildLineChart("legend-line-chart");
        },
        'should generate legend g': function (chart) {
            assert.isFalse(legend(chart).empty());
        },
        'should generate legend g transform for correct placement': function (chart) {
            assert.equal(legend(chart).attr("transform"), "translate(400,10)");
        },
        'should generate correct number of legend items': function (chart) {
            assert.equal(legendItems(chart).size(), 3);
        },
        'should place legend items vertically with gap in between': function (chart) {
            assert.equal(d3.select(legendItems(chart)[0][0]).attr("transform"), "translate(0,0)");
            assert.equal(d3.select(legendItems(chart)[0][1]).attr("transform"), "translate(0,18)");
            assert.equal(d3.select(legendItems(chart)[0][2]).attr("transform"), "translate(0,36)");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);