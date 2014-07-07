Template.channelEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentChannelId = this._id;
    
    var channelProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }
    
    Channels.update(currentChannelId, {$set: channelProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('channelPage', {_id: currentChannelId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this channel?")) {
      var currentChannelId = this._id;
      Channels.remove(currentChannelId);
      Router.go('home');
    }
  }
});
