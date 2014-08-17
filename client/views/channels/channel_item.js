var CHANNEL_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.channelItem.helpers({
    playPauseButtonTitle: function() {
        console.log("client/views/channels/channel_item.js: playPauseButtonTitle");
        return this.playing === true ? "Stop" : "Play";
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
});

//VLC.play("http://lyd.nrk.no/nrk_radio_p13_mp3_h");