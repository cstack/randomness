import Ember from 'ember';

export default Ember.Controller.extend({
  length: (function() {
    return this.model.get('contents').length;
  }).property('model.contents'),

  sequences: (function() {
    var s = [];
    for (var l=1; l<=4; l++) {
      if (l == 1) {
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
    }
    for (var l=1; l<=4; l++) {
      for (var i=l; i<=s.length; i++)
      increment(s.slice(i-l, i));
    }
    return f;
  }).property('model.contents'),

  frequencies: (function() {
    var f = this.get('frequencyMap');
    var seqs = this.get('sequences');
    var result = [];
    for (var l=1; l<=4; l++) {
      var pairs = [];
      for (var i=0; i<seqs[l].length; i++) {
        pairs.push([seqs[l][i], f[seqs[l][i]]]);
      }
      result.push(pairs);
    }
    return result;
  }).property('frequencyMap', 'sequences'),
});
