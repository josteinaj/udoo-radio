Meteor.publish('channels', function(options) {
  return Channels.find({}, options);
});

Meteor.publish('singleChannel', function(id) {
  return id && Channels.find(id);
});


Meteor.publish('comments', function(channelId) {
  return Comments.find({channelId: channelId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});