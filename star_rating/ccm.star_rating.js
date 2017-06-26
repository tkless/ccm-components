/**
 * @overview ccm component for voting
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */
( function () {
  var ccm_version = '8.0.0';
  var ccm_url     = '../libs/ccm.js';
  var component_name = 'star_rating';
  var component_obj  = {

    name: component_name,
    config: {
      templates: {
        "main": {
          "class" : "rating"
        },

        "input": {
          "tag": "input",
          "type": "radio",
          "name": "rating",
          "id":   "%id%",
          "value":"%star%",
          "onclick": "%click%"
        },

        "label": {
          "tag": "label",
          "class": "label",
          "for": "%for%",
          "title": "%title%"
        }
      },

      data:  {
          store: [ 'ccm.store', '../star_rating/datastore.json' ],
          key:   'demo'
      },
      user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js'],
      style: [ 'ccm.load', '../star_rating/style.css' ],
      icons: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'],
      star_title: [ "Gefällt mir gar nicht", "Gefällt mir nicht",
                    "Ist Ok", "Gefällt mir", "Gefällt mir sehr" ]
    },

    Instance: function () {
      var self = this;
      var total = 0;

      this.init = function ( callback ) {

        // listen to change event of ccm realtime datastore => (re)render own content
        self.data.store.onChange = function () { self.start(); };

        callback();
      };

      this.start = function ( callback ) {

        document.head.appendChild( self.ccm.helper.html( {
           tag:   'style',
           inner: "@font-face { font-family: 'FontAwesome'; src: url('../libs/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0'); src: url('../libs/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../libs/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../libs/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../libs/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../libs/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg'); font-weight: normal; font-style: normal; }"
        } ) );

        self.ccm.helper.dataset( self.data.store, self.data.key, function ( dataset ) {
          if ( !dataset ) dataset = {};

          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main ) ) );

          //calculate average of rating
          var sum = 0;
          var count = 0;

          for ( var key in dataset ) {
            if ( key !== "key" ) {
              sum += key * Object.keys( dataset[ key ] ).length;
              count += Object.keys( dataset[ key ] ).length;
            }
          }
          total = sum / count;

          //render html content
          renderStars();

          function renderStars() {

            for ( var i = 5; i >= 1; i-- ) {
              self.element.querySelector( '.rating' ).appendChild( self.ccm.helper.protect( self.ccm.helper.html( self.templates.input, {
                id: i,
                star: i,
                click: function() { doVoting(); }
              } ) ) );

              self.element.querySelector( '.rating' ).appendChild( self.ccm.helper.protect( self.ccm.helper.html( self.templates.label, {
                for: i,
                title: ( i === 0.5 ) ? self.star_title[ 0 ] : self.star_title[ ( i * 2 ) - 1 ]
              } ) ) );
            }

          }

          function doVoting() {
            if ( !self.user )
                return;

            self.user.login( function () {

              var checked = self.element.querySelector( 'input[name = "rating"]:checked' ).value;

              var user = self.user.data().key;

              if ( !dataset[ checked ] )
                dataset[ checked ] = {};

              if ( dataset[ checked ][ user ] ) {
                // revert vote
                delete dataset[ checked ][ user ];
              }
              // not voted
              else {

                // proceed voting
                dataset[ checked ][ user ] = true;
              }

              // update dataset for rendering => (re)render own content
              //self.data.store.set( dataset, function () { self.start(); } );

            });
          }

          if ( callback )callback();
        } );

      };

      this.getVoting = function () {
       return total;
      }

    }
  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );