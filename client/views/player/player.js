Template.player.helpers({
    playPauseButtonTitle: function() {
        console.log("client/views/player/player.js: playPauseButtonTitle");
        return this.playing === true ? "Stop" : "Play";
    },
    title: function() {
        var channel;
        console.log("client/views/player/player.js: title");
        if (this._id === null) {
            return "---";
        } else {
            channel = Channels.findOne({_id: this.channel});
            console.log(channel, Channels.findOne());
            if (channel) {
                return channel.title;
            } else {
                return "- -"
            }
        }
    }
});

Template.player.events({
  'click #playbutton': function(e) {
    var player;
    e.preventDefault();
    
    player = Player.findOne();
    console.log("client/views/player/player.js: click #playbutton");
    
    if (player.playing === true) {
        Meteor.call(
                    'stop',
                    Meteor.bindEnvironment(function (error, result) {
                        console.log("client/views/player/player.js: called 'stop'",error,result);
                    })
        );
    } else {
        Meteor.call(
                    'play',
                    player.channel,
                    Meteor.bindEnvironment(function (error, result) {
                        console.log("client/views/player/player.js: called 'play'",error,result);
                    })
        );
    }
  },
  
  'input #volumeSlider': function(e) {
    var player, volumeSlider;
    e.preventDefault();
    
    player = Player.findOne();
    volumeSlider = document.getElementById("volumeSlider");
    console.log("client/views/player/player.js: input #volumeSlider");
    console.log("    volumeSlider.value: ", volumeSlider.value);
    
    Meteor.call(
                'setVolume',
                volumeSlider.value,
                Meteor.bindEnvironment(function (error, result) {
                    console.log("client/views/player/player.js: called 'setVolume'",error,result);
                })
    );
  }
  
});
