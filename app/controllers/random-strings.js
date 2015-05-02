import Ember from 'ember';

export default Ember.Controller.extend({
  length: (function() {
    return this.model.get('contents').length;
  }).property('model.contents')
});
