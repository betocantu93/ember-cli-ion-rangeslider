module.exports = {
  description: 'Sets up required ember-cli-ion-rangeslider dependencies',
  name: 'ember-cli-ion-rangeslider',
  normalizeEntityName: function(){},

  afterInstall: function(){
    return this.addPackageToProject('ion-rangeslider');
  }
};
