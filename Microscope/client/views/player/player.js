Template.player.helpers({
    playPauseButtonTitle: function() {
        console.log("client/views/player/player.js: playPauseButtonTitle");
        return this.playing === true ? "Stop" : "Play";
    }
});

Template.player.events({
  'click #playbutton': function(e) {
    console.log("client/views/player/player.js: click #playbutton");
    var player = Player.findOne();
    console.log(player);
    var playButton = document.getElementById("playbutton");
    console.log(playButton);
    
    e.preventDefault();
    
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
                    player.url,
                    Meteor.bindEnvironment(function (error, result) {
                        console.log("client/views/player/player.js: called 'play'",error,result);
                    })
        );
    }
  },
  
  'input #volumeSlider': function(e) {
    var audioTrack = document.getElementById("audiotrack");
    var volumeSlider = document.getElementById("volumeSlider");
    
    e.preventDefault();
    
    audioTrack.volume = volumeSlider.value;
  }
  
});
