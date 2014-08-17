Template.channelsList.helpers({
  channelsWithRank: function() {
    this.channels.rewind();
    return this.channels.map(function(channel, index, cursor) {
      channel._rank = index;
      return channel;
    });
  }
});
