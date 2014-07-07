Channels = new Meteor.Collection('channels');

Channels.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Channels.deny({
  update: function(userId, channel, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  channel: function(channelAttributes) {
    var user = Meteor.user(),
      channelWithSameLink = Channels.findOne({url: channelAttributes.url});
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to channel new stories");
    
    // ensure the channel has a title
    if (!channelAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');
    
    // check that there are no previous channels with the same link
    if (channelAttributes.url && channelWithSameLink) {
      throw new Meteor.Error(302, 
        'This link has already been channeled', 
        channelWithSameLink._id);
    }
    
    // pick out the whitelisted keys
    var channel = _.extend(_.pick(channelAttributes, 'url', 'title', 'message'), {
      userId: user._id, 
      author: user.username, 
      submitted: new Date().getTime(),
      upvoters: [], votes: 0
    });
    
    var channelId = Channels.insert(channel);
    
    return channelId;
  },
  
  upvote: function(channelId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");
    
    Channels.update({
      _id: channelId, 
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});