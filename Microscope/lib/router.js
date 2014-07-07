Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
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

NewChannelsListController = ChannelsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newChannels.path({channelsLimit: this.limit() + this.increment})
  }
});

BestChannelsListController = ChannelsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestChannels.path({channelsLimit: this.limit() + this.increment})
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewChannelsListController
  });
  
  this.route('newChannels', {
    path: '/new/:channelsLimit?',
    controller: NewChannelsListController
  });
  
  this.route('bestChannels', {
    path: '/best/:channelsLimit?',
    controller: BestChannelsListController
  });
  
  this.route('channelPage', {
    path: '/channels/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singleChannel', this.params._id),
        Meteor.subscribe('comments', this.params._id)
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
