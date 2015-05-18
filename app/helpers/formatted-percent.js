import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value) {
  return (value * 100).toFixed(2).toString() + "%";
});
