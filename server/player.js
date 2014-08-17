Meteor.publish('player', function() {
  return Player.find();
});

Meteor.methods({
  'play': function(channelId) {
    var player = Player.findOne();
    var channel;
    console.log("server/player.js: play: "+channelId);
    if (channelId) {
      channel = Channels.findOne({_id: channelId});
      if (channel) {
        Player.update(player._id, {$set: {channel:channel._id, url:channel.url, playing:true}});
        VLC.play(channel.url);
      } else {
        console.log("server/player.js: no such channel: "+channelId);
      }
    } else {
      Player.update(player._id, {$set: {playing:true}});
      VLC.play(player.url);
    }
    return player;
  },
  'stop': function() {
    var player = Player.findOne();
    VLC.stop();
    console.log("server/player.js: stop: "+player.url);
    console.log(player);
    return player;
  }
});

Meteor.startup(function(){
    VLC.on('stop',
            Meteor.bindEnvironment(function (url) {
                var player = Player.findOne();
                console.log("server/player.js: VLC.on('stop', ...)");
                console.log(Player.update(player._id, {$set: {playing:false}}));
                console.log(Player.findOne());
            })
    );
});