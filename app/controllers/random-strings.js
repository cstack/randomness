import Ember from 'ember';

var MAX_LENGTH = 4;

export default Ember.Controller.extend({
  length: (function() {
    return this.model.get('contents').length;
  }).property('model.contents'),

  score: function(values) {
    var min = Number.MAX_VALUE;
    var max = 0;
    for (var i=0; i<values.length; i++) {
      var v = values[i];
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    debugger
    return min * 1.0 / (max + 1);
  },

  randomness: (function() {
    var frequencies = this.get('frequencies');
    var result = 0;
    for (var l=1; l<=MAX_LENGTH; l++) {
      result += this.score(frequencies[l]);
    }
    return result / MAX_LENGTH;
  }).property('frequencies'),

  sequences: (function() {
    var s = [];
    for (var l=1; l<=MAX_LENGTH; l++) {
      if (l === 1) {
        s[l] = ["0", "1"];
      } else {
        var seqs = [];
        for (var i=0; i<s[l-1].length; i++) {
          seqs.push(s[l-1][i] + "0");
          seqs.push(s[l-1][i] + "1");
        }
        s[l] = seqs;
      }
    }
    return s;
  }).property(),

  frequencyMap: (function() {
    var s = this.model.get('contents');
    var f = {};
    var increment = function(key) {
      if (typeof f[key] === "undefined") {
        f[key] = 0;
      }
      f[key] += 1;
    };
    for (var l=1; l<=4; l++) {
      for (var i=l; i<=s.length; i++) {
        increment(s.slice(i-l, i));
      }
    }
    return f;
  }).property('model.contents'),

  frequencies: (function() {
    var f = this.get('frequencyMap');
    var seqs = this.get('sequences');
    var result = [];
    for (var l=1; l<=MAX_LENGTH; l++) {
      result[l] = [];
      for (var i=0; i<seqs[l].length; i++) {
        var frequency = f[seqs[l][i]] || 0;
        result[l].push(frequency);
      }
    }
    return result;
  }).property('frequencyMap', 'sequences'),

  chartData: function(xValues, yValues) {
    return {
      labels: xValues,
      datasets: [
        {
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,0.8)",
          highlightFill: "rgba(151,187,205,0.75)",
          highlightStroke: "rgba(151,187,205,1)",
          data: yValues
        }
      ]
    }
  },

  chartDataByLength: (function() {
    var sequences = this.get('sequences');
    var frequencies = this.get('frequencies');
    var result = [];
    for (var l=1; l<=MAX_LENGTH; l++) {
      result.push(this.chartData(sequences[l], frequencies[l]));
    }
    return result;
  }).property('sequences', 'frequencies')
});
