Player = new Meteor.Collection('player');

Player.allow({
  insert: function() { return false; },
  remove: function() { return false; },
  update: function() { return true; }
});