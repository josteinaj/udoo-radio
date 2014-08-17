Template.channelSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var channel = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      message: $(e.target).find('[name=message]').val()
    }
    
    Meteor.call('channel', channel, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        
        if (error.error === 302)
          Router.go('channelPage', {_id: error.details})
      } else {
        Router.go('channelPage', {_id: id});
      }
    });
  }
});