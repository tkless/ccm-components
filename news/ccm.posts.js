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

            templates:  [ 'ccm.store', '../news/templates.json' ],
            data:  {
              store: [ 'ccm.store', '../news/datastore.json' ],
              key: 'demo'
            },
            style: [ 'ccm.load', '../news/style.css' ],
            icons: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'  ],
            user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js' ],
            editable: false//[true, false, "user"]
        },

        Instance: function () {

            var self = this;

            this.start = function ( callback ) {


                // login user if not logged in
                if ( self.editable && !self.user.isLoggedIn() ) return self.user.login( function () { self.start( callback ); } );

                // get dataset for rendering
                self.ccm.helper.dataset( self.data.store, self.data.key, function ( dataset ) {

                    if ( !dataset.posts ) dataset.posts = [];

                    self.element.innerHTML = '';

                    console.log(self.templates.get('main'));

                    // render main html structure
                    self.element.appendChild( self.ccm.helper.protect( self.ccm.helper.html( self.templates.get( 'main' ), {
                        click: function () {
                            updatePost();
                        }
                    })));

                    for ( var i = 0; i < dataset.posts.length; i++ ) {
                        renderPost( dataset.posts[i], i) ;
                    }
                    if ( self.editable )
                        renderPost( newPost(), dataset.posts.length );

                    self.element.querySelector( '.post:first' ).classList.add( 'new_post' );

                    //placehoder for empty content
                    self.element.querySelector( 'div[contenteditable="true"]' ).classList.add( 'empty' );

                    // no close icon for emty post
                    self.element.querySelector( '.fa-close' ).classList.remove( '.fa-close' );

                    /**
                     * when editable set to false no delete and post possible
                     * so remove all colose icons and post-button
                     */
                    if ( !self.editable ) {
                        self.element.querySelector( '.fa-close' ).classList.remove( '.fa_close' );
                        self.element.querySelector( '.button' ).classList.remove( '.button' );
                    }

                    // perform callback
                    if ( callback ) callback();

                    function renderPost( post, i )  {

                        self.element.querySelector( '.posts' ).insertBefore(  ccm.helper.html( self.templates.post, {
                            delete_post: function () {
                                dataset.posts.splice(i, 1);
                                updatePost();
                            },

                            title: ccm.helper.val( post.title || "" ),
                            date: ccm.helper.val( post.date ),
                            name: ccm.helper.val( post.user ),
                            avatar: ccm.helper.val( post.avatar || 'fa fa-user fa-fw fa-lg' ),
                            content: ccm.helper.val ( post.content || "" ),
                            edit: !!self.editable,
                            input_title: function () {
                                change( i, jQuery( this ), "title" );
                            },
                            input_content: function () {
                                change( i, jQuery( this ), "content" );
                            }

                        } ),  self.element.querySelector( '.posts' ) );
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

                        return dd + ' ' + monat[ mm].substring(0, 3) + '. '  + yyyy + ' ' + hour + ':' + min;

                    }

                    function change (post, div, prop) {

                        if ( post === dataset.posts.length) dataset.posts.push( newPost() );

                        dataset.posts[post][prop] = ccm.helper.val( jQuery.trim( div.html().replace(new RegExp('\r?\n','g'), '') ) );

                        if (div.text().length == 0 )
                            div.classList.add("empty").innerHTML = ' ';
                        else
                            div.classList.remove("empty");
                    }

                    function newPost() {
                        return {

                            date: getDateTime(),
                            user: self.user.data().key,
                            avatar: self.user.data().avatar || ''
                        }
                    }

                    function updatePost() {
                        self.store.set(dataset, function () {
                            self.start();
                        });
                    }

                } );


            };

        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );