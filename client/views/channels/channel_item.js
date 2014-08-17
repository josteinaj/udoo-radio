var CHANNEL_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.channelItem.helpers({
    playPauseButtonTitle: function() {
        var player = Player.findOne();
        console.log("client/views/channels/channel_item.js: playPauseButtonTitle");
        if (player.playing === true && player.channel === this._id) {
            return "Stop";
        } else {
            return "Play";
        }
    },
    ownChannel: function() {
        return this.userId == Meteor.userId();
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    attributes: function() {
        var channel = _.extend({}, Positions.findOne({channelId: this._id}), this);
        var newPosition = channel._rank * CHANNEL_HEIGHT;
        var attributes = {};
        
        if (_.isUndefined(channel.position)) {
            attributes.class = 'channel invisible';
        } else {
            var delta = channel.position - newPosition;            
            attributes.style = "top: " + delta + "px";
            if (delta === 0)
                attributes.class = "channel animate"
        }
        
        Meteor.setTimeout(function() {
            Positions.upsert({channelId: channel._id}, {$set: {position: newPosition}})
        });
        
        return attributes;
    }
});

Template.channelItem.events({
    'click .channel-playbutton': function(e) {
        var player;
        e.preventDefault();
        player = Player.findOne();
        console.log("client/views/channels/channel_item.js: click .channel-playbutton");
        
        if (player.playing === true) {
            Meteor.call(
                        'stop',
                        Meteor.bindEnvironment(function (error, result) {
                            console.log("client/views/channels/channel_item.js: called 'stop'",error,result);
                        })
            );
        } else {
            Meteor.call(
                        'play',
                        this._id,
                        Meteor.bindEnvironment(function (error, result) {
                            console.log("client/views/channels/channel_item.js: called 'play'",error,result);
                        })
            );
        }
    }
});
