Notifications = new Meteor.Collection('notifications');

Notifications.allow({
  update: ownsDocument
});

createCommentNotification = function(comment) {
  var channel = Channels.findOne(comment.channelId);
  if (comment.userId !== channel.userId) {
    Notifications.insert({
      userId: channel.userId,
      channelId: channel._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};