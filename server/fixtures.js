// Fixture data 
if (Channels.find().count() === 0) {
  var now = new Date().getTime();
  
  // create two users
  /*var tomId = Meteor.users.insert({
    profile: { name: 'Tom Coleman' }
  });
  var tom = Meteor.users.findOne(tomId);
  var sachaId = Meteor.users.insert({
    profile: { name: 'Sacha Greif' }
  });
  var sacha = Meteor.users.findOne(sachaId);*/
  
  Channels.insert({
    type: 'STREAM',
    title: 'NRK P1',
    url: 'http://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_h',
    submitted: now - 10 * 3600 * 1000
  });
  
  Channels.insert({
    type: 'STREAM',
    title: 'NRK P2',
    url: 'http://lyd.nrk.no/nrk_radio_p2_mp3_h',
    submitted: now - 12 * 3600 * 1000
  });
  
  Channels.insert({
    type: 'STREAM',
    title: 'NRK P3',
    url: 'http://lyd.nrk.no/nrk_radio_p3_mp3_h',
    submitted: now - 14 * 3600 * 1000
  });
  
  Channels.insert({
    type: 'STREAM',
    title: 'NRK mP3',
    url: 'http://lyd.nrk.no/nrk_radio_mp3_mp3_h',
    submitted: now - 14 * 3600 * 1000
  });
  
  Channels.insert({
    type: 'STREAM',
    title: 'NRK P13',
    url: 'http://lyd.nrk.no/nrk_radio_p13_mp3_l',
    submitted: now - 14 * 3600 * 1000
  });
  
}

// Fixture data 
if (Player.find().count() === 0) {
  
  Player.insert({
    /*title: "NRK P3",
    url: "http://lyd.nrk.no/nrk_radio_p3_mp3_h",*/
    channel: Channels.findOne()._id,
    playing: false
  });
  
}