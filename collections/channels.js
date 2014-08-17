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
      throw new Meteor.Error(401, "You need to login to add new channels");
    
    // ensure the channel has a title
    if (!channelAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a channel title');
    
    // check that there are no previous channels with the same link
    if (channelAttributes.url && channelWithSameLink) {
      throw new Meteor.Error(302, 
        'This channel link has already been added', 
        channelWithSameLink._id);
    }
    
    // pick out the whitelisted keys
    var channel = _.extend(_.pick(channelAttributes, 'url', 'title', 'message'), {
      submitted: new Date().getTime()
    });
    
    var channelId = Channels.insert(channel);
    
    return channelId;
  }
});