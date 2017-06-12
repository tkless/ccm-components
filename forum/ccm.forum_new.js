/**
 * @overview ccm component for questions and answers
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {
    var ccm_version = '8.0.0';
    var ccm_url     = '../libs/ccm.js';
    var component_name = 'forum';
    var component_obj  = {

        name: component_name,
        config: {
            user:   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js'],
            data:   {
                store: [ '../forum/datastore.json' ],
                key:   'demo'
            },
            style:   [ 'ccm.load', '../forum/style.css' ],
            tejs:    [ 'ccm.load', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-te/1.4.0/jquery-te.min.js' ],
            tecss:   [ 'ccm.load', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-te/1.4.0/jquery-te.min.css' ]
        },

        Instance: function () {
            var self = this;

            this.init = function ( callback ) {
            };

            this.ready = function ( callback ) {
            };

            this.start = function ( callback ) {

                // get dataset for questions and answers
                self.data.store.get( self.data.key, function ( dataset ) {

                    // dataset not exists? => create new dataset for questions and answers
                    if ( !dataset ) self.data.store.set( { key: self.data.key, questions: [] }, proceed ); else proceed( dataset );

                    function proceed( dataset ) {

                        // remember current dataset for questions and answers
                        qa_dataset = dataset;

                        renderQuestionsView();

                        // render user login
                        if ( self.user ) { self.element.prepend( '<div class="qa_user"></div>' ); self.user.render(); }

                        // perform callback
                        if ( callback ) callback();

                    }

                } );

            };

        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );
