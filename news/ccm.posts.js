/**
 * @overview posts template for <i>ccm</i> component
 * @author Tea Kless <tea.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = '../libs/ccm.js';

  var component_name = 'posts';
  var component_obj  = {

    name: component_name,

    config: {
      templates: {
        "main": {
          "tag": "div",
          "id": "main",
          "inner": [
            {
              "tag": "div",
              "id": "button",
              "inner":
                {
                  "tag": "button",
                  "onclick": "%click%",
                  "inner": "posten"
                }
            },
            {
              "tag": "div",
              "id": "posts"
            }
          ]
        },

        "post": {
          "tag": "div",
          "class": "post",
          "inner": [
            {
              "tag": "div",
              "class": "close fa fw fa-close",
              "onclick": "%delete_post%"
            },
            {
              "tag": "div",
              "class": "head",
              "inner": [
                {
                  "tag": "div",
                  "class": "title",
                  "inner": [
                    {
                      "tag": "div",
                      "class": "date",
                      "inner": "%date%"
                    },
                    {
                      "tag": "div",
                      "inner": "%title%",
                      "contenteditable": "%edit%",
                      "oninput": "%input_title%"
                    }
                  ]
                },
                {
                  "tag": "div",
                  "class": "user",
                  "inner": [
                    {
                      "tag": "div",
                      "class": "name",
                      "inner": "%name%"
                    },
                    {
                      "tag": "div",
                      "class": "%avatar%"
                    }
                  ]
                }
              ]
            },
            {
              "tag": "div",
              "class": "content",
              "inner": {
                "tag": "div",
                "inner": "%content%",
                "contenteditable": "%edit%",
                "oninput": "%input_content%"
              }
            }
          ]
        }

      },
      data:  {
        store: [ 'ccm.store', '../news/datastore.json' ],
        key: 'demo'
      },
      style: [ 'ccm.load', '../news/style.css' ],
      icons: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'  ],
      user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js' ],
      editable: true//[true, false, "user"]
    },

    Instance: function () {

      var self = this;

      this.start = function ( callback ) {

        document.head.appendChild( self.ccm.helper.html( {
          tag:   'style',
          inner: "@font-face { font-family: 'FontAwesome'; src: url('../libs/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0'); src: url('../libs/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../libs/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../libs/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../libs/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../libs/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg'); font-weight: normal; font-style: normal; }"
        } ) );

        // login user if not logged in
        if ( self.editable && !self.user.isLoggedIn() ) return self.user.login( function () { self.start( callback ); } );

        // get dataset for rendering
        self.ccm.helper.dataset( self.data.store, self.data.key, function ( dataset ) {

          if ( !dataset.posts ) dataset.posts = [];

          // render main html structure
          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main, {
            click: function () {
              updatePost();
            }
          } ) ) );

          for ( var i = 0; i < dataset.posts.length; i++ ) {
              renderPost( dataset.posts[i], i) ;
          }
          if ( self.editable )
            renderPost( newPost(), dataset.posts.length );

          //placehoder for empty content
          var first = self.element.querySelector( '#posts' ).firstElementChild;
          first.classList.add( 'new_post' );
          var divs = first.querySelectorAll( 'div[contenteditable]' );

          if ( divs[0].getAttribute( 'contenteditable' ) === 'true' );
            divs[0].classList.add( 'empty' );
          if ( divs[1].getAttribute( 'contenteditable' ) === 'true' );
            divs[1].classList.add( 'empty' );

          // no close icon for emty post
          first.querySelector( '.fa-close' ).classList.remove( 'fa-close' );

          /**
           * when editable set to false no delete and post possible
           * so remove all colose icons and post-button
           */
          if ( !self.editable ) {
            self.element.querySelector( '.fa-close' ).classList.remove( '.fa_close' );
            self.element.querySelector( '#button' ).removeAttribute( 'id' );
          }

          // perform callback
          if ( callback ) callback();

          function renderPost( post, i )  {

            var posts = self.element.querySelector( '#posts' );
            var post_elem = self.ccm.helper.protect( self.ccm.helper.html( self.templates.post, {
              delete_post: function () {
                dataset.posts.splice(i, 1);
                updatePost();
              },

              title:   post.title || "",
              date:    post.date,
              name:    post.user,
              avatar:  post.avatar || 'fa fa-user fa-fw fa-lg',
              content: post.content || "",
              edit:    !!self.editable,

              input_title: function () {
                console.log(this);
                change( i, this, "title" );
              },
              input_content: function () {
                change( i, this, "content" );
              }
            } ) );

            if( posts.hasChildNodes() )
              posts.insertBefore( post_elem, posts.firstChild );
            else
              posts.appendChild( post_elem );
          }

          function getDateTime () {

            var today = new Date();
            var dd    = today.getDate();
            var mm    = today.getMonth();
            var yyyy  = today.getFullYear();
            var hour  = today.getHours();
            var min   = today.getMinutes();

            var monat = ["Januar", "Februar", "März", "April", "Mai", "Juni","Juli", "August", "September", "Oktober", "November", "Dezember"];

            if ( dd < 10 ) dd = '0' + dd;

            if ( hour < 10 ) hour = '0' + hour;
            if ( min  < 10 ) min  = '0' + min;

            return dd + ' ' + monat[ mm ].substring( 0, 3 ) + '. '  + yyyy + ' ' + hour + ':' + min;

          }

          function change ( post, div, prop ) {

            if ( post === dataset.posts.length ) dataset.posts.push( newPost() );

            dataset.posts[ post ][ prop ] = div.innerHTML.replace( new RegExp( '\r?\n', 'g' ), '' ).trim();

            if ( !div.innerHTML )
              div.classList.add( 'empty' ).innerHTML = ' ';
            else
              div.classList.remove( 'empty' );
          }

          function newPost() {
            return {
              date: getDateTime(),
              user: self.user.data().key,
              avatar: self.user.data().avatar || ''
            }
          }

          function updatePost() {
            self.data.store.set(dataset, function () {
              self.start();
            } );
          }

        } );

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );