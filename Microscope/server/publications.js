Meteor.publish('channels', function(options) {
  return Channels.find({}, options);
});

Meteor.publish('singleChannel', function(id) {
  return id && Channels.find(id);
});
