var CHANNEL_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.channelItem.helpers({
  ownChannel: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  },
  attributes: function() {
    var channel = _.extend({}, Positions.findOne({channelId: this._id}), this);
    var newPosition = channel._rank * CHANNEL_HEIGHT;
    var attributes = {};
    
    if (_.isUndefined(channel.position)) {
      attributes.class = 'channel invisible';
    } else {
      var delta = channel.position - newPosition;      
      attributes.style = "top: " + delta + "px";
      if (delta === 0)
        attributes.class = "channel animate"
    }
    
    Meteor.setTimeout(function() {
      Positions.upsert({channelId: channel._id}, {$set: {position: newPosition}})
    });
    
    return attributes;
  }
});

Template.channelItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});