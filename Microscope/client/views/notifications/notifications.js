Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
  	return Notifications.find({userId: Meteor.userId(), read: false}).count();
  }
});

Template.notification.helpers({
  notificationChannelPath: function() {
    return Router.routes.channelPage.path({_id: this.channelId});
  }
})

Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
})