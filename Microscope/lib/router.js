Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return []
  }
});

ChannelsListController = RouteController.extend({
  template: 'channelsList',
  increment: 5, 
  limit: function() { 
    return parseInt(this.params.channelsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('channels', this.findOptions());
  },
  channels: function() {
    return Channels.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.channels().count() === this.limit();
    return {
      channels: this.channels(),
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

ChannelsListController = ChannelsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.channels.path({channelsLimit: this.limit() + this.increment})
  }
});

Router.map(function() {
  this.route('player', {
    path: '/',
    waitOn: function() {
      return [
        Meteor.subscribe('player')
      ];
    },
    data: function() { return Player.findOne(); }
  });
  
  this.route('channels', {
    path: '/new/:channelsLimit?',
    controller: ChannelsListController
  });
  
  this.route('channelPage', {
    path: '/channels/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singleChannel', this.params._id)
      ];
    },
    data: function() { return Channels.findOne(this.params._id); }
  });

  this.route('channelEdit', {
    path: '/channels/:_id/edit',
    waitOn: function() { 
      return Meteor.subscribe('singleChannel', this.params._id);
    },
    data: function() { return Channels.findOne(this.params._id); }
  });
  
  this.route('channelSubmit', {
    path: '/submit',
    progress: {enabled: false}
  });
});


var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    
    pause();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'channelSubmit'});
Router.onBeforeAction(function() { clearErrors() });
