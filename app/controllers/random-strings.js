import Ember from 'ember';

var MAX_LENGTH = 4;
var MINIMUM_LENGTH_FOR_SCORE = 100;

export default Ember.Controller.extend({
  length: (function() {
    return this.model.get('contents').length;
  }).property('model.contents'),

  scoreForFrequencies: function(values) {
    var min = Number.MAX_VALUE;
    var max = 0;
    for (var i=0; i<values.length; i++) {
      var v = values[i];
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    return min * 1.0 / (max + 1);
  },

  scoreForString: function(s) {
    var f = this.frequenciesForString(s);
    var result = 0;
    for (var l=1; l<=MAX_LENGTH; l++) {
      result += this.scoreForFrequencies(f[l]);
    }
    return result / MAX_LENGTH;
  },

  frequenciesForString: function(s) {
    var f = this.frequencyMapForString(s);
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
  },

  frequencyMapForString: function(s) {
    var f = {};
    var increment = function(key) {
      if (typeof f[key] === "undefined") {
        f[key] = 0;
      }
      f[key] += 1;
    };
    for (var l=1; l<=MAX_LENGTH; l++) {
      for (var i=l; i<=s.length; i++) {
        increment(s.slice(i-l, i));
      }
    }
    return f;
  },

  randomString: function(n) {
    var s = "";
    for (var i=0; i<n; i++) {
      if (Math.random() < 0.5) {
        s += "0";
      } else {
        s += "1"
      }
    }
    return s;
  },

  minimumLength: (function() {
    return MINIMUM_LENGTH_FOR_SCORE;
  }).property(),

  longEnough: (function() {
    return this.get('length') >= this.get('minimumLength');
  }).property('length', 'minimumLength'),

  randomness: (function() {
    return this.scoreForString(this.model.get('contents'));
  }).property('model.contents'),

  trueRandomness: (function() {
    return this.scoreForString(this.randomString(this.get('length')));
  }).property('length'),

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

  frequencies: (function() {
    return this.frequenciesForString(this.get('model.contents'))
  }).property('model.contents', 'sequences'),

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
