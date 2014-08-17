Meteor.publish('player', function() {
  return Player.find();
});

Meteor.methods({
  'play': function(url) {
    var player = Player.findOne();
    url = url || player.url;
    Player.update(player._id, {$set: {playing:true}});
    VLC.play(url);
    console.log("server/player.js: play: "+url);
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
                setTimeout(Meteor.bindEnvironment(function(){
                  console.log(Player.findOne());
                }),1000);
            })
    );
});