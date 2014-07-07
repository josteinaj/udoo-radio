Template.channelPage.helpers({
  comments: function() {
    return Comments.find({channelId: this._id});
  }
});