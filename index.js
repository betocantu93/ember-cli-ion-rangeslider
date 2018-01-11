/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var map = require('broccoli-stew').map;

var packagedSkins = {
  'flat':   ['skinFlat.css', 'sprite-skin-flat.png'],
  'html5':  ['skinHTML5.css', null],
  'modern': ['skinModern.css', 'sprite-skin-modern.png'],
  'nice':   ['skinNice.css', 'sprite-skin-nice.png'],
  'simple': ['skinSimple.css', 'sprite-skin-simple.png']
};

module.exports = {
  name: 'ember-cli-ion-rangeslider',

  envConfig: function(){
    return this.project.config(process.env.EMBER_ENV || 'development');
  },

  importSkin: function(skin){
    var skinAssets = packagedSkins[skin.toLowerCase()] || [null, null],
        style = skinAssets[0],
        img = skinAssets[1];

    if (style){
      this.import('vendor/ion-rangeslider/css/ion.rangeSlider.' + style);
    }
    if (img){
      this.import('vendor/ion-rangeslider/img/' + img, {
        destDir: 'img'
      });
    }
  },

  included: function(){

    this._super.included.apply(this, arguments);

    var config = this.envConfig()[this.name] || this.options[this.name] || {};

    this.import({
      production: 'vendor/ion-rangeslider/js/ion.rangeSlider.min.js',
      development: 'vendor/ion-rangeslider/js/ion.rangeSlider.js'
    });
    this.import('vendor/ion-rangeslider/css/ion.rangeSlider.css');

    // Show something on the screen, when no skin is provided
    // If user set the skin to null explicitly, don't load any assets

    if(typeof(config.skin) === 'undefined'){
      this.importSkin('flat'); // default skin
    }
    else if (config.skin){
      this.importSkin(config.skin);
    }
  },

  treeForVendor(vendorTree) {

    let libs = new Funnel(path.join(this.project.root, 'node_modules', 'ion-rangeslider'), {
        destDir: 'ion-rangeslider'
      });
    libs = map(libs, (content, fileName) => {
      if(fileName.includes("ion-rangeslider/css/") || fileName.includes("ion-rangeslider/img/")){
        return content;
      } else {
        return `if (typeof FastBoot === 'undefined') { ${content} }`
      }
    });

    return new MergeTrees([vendorTree, libs]);;

  },
};
