/**
 * @overview <i>ccm</i> component for lecture
 * @author Tea Kless <tea.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.lecture
   * @type {ccm.name}
   */
  name: 'lecture',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.lecture
   * @type {ccm.components.lecture.config}
   */
  config: {

    chat:           [ ccm.component, 'http://tkless.github.io/ccm-components/resources/chat/ccm.chat.js', {
      html:         [ ccm.load,      'http://tkless.github.io/ccm-components/resources/chat/chat_hbrs_html.json' ],
      style:        [ ccm.load,      'http://tkless.github.io/ccm-components/resources/chat/lecture_chat.css' ],
      store:        [ ccm.store,     '../demoData/chat.json'],
      lang:         null,
      user:         null
    } ],

    code_trainer:   [ ccm.component, '../codeTrainer/ccm.code_trainer.js', {
      store:        [ ccm.store,     '../demoData/we_exercise.json' ],
      style:        [ ccm.load,      '../codeTrainer/code_trainer.css' ],
      standalone:   false
    } ],

    contents:       [ ccm.load,      '../demoData/we_contents.json' ],

    course:         'Web Engineering',

    classes:        'ccm-lecture',

    feedback_store: [ ccm.store ],

    forms:          [ ccm.component, 'http://tkless.github.io/ccm-components/resources/form/ccm.input.js', {
      style:        [ ccm.load,      'http://tkless.github.io/ccm-components/resources/form/input.css'],
      store:        [ ccm.store,     '../demoData/we_inputs.json' ]
    } ],

    forum:          [ ccm.component, '../forum/ccm.forum.js', {
      style:        [ ccm.load,      '../forum/style.css' ],
      store:        [ ccm.store,     '../forum/forum.json'],
      lang:         null,
      user:         null
    } ],


    html:           [ ccm.load,      '../app/lecture_html.json' ],

    icons:          [ ccm.load,      'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' ],

    google_slides:  [ ccm.component, '../iframe/ccm.iframe.js', {
        style:      [ ccm.load,      '../iframe/iframe.css' ]
      } ],

    key:            'demo',

    layouts:        [ 'footer', 'bars', 'content_icons', 'posts', 'forum', 'lecture_chat' ],

    menu:           [ ccm.component, 'http://tkless.github.io/ccm-components/resources/menu/ccm.menu.js', {
      style:        [ ccm.load,      'http://tkless.github.io/ccm-components/resources/menu/menu_footer.css' ],
      style2:       [ ccm.load,      'http://tkless.github.io/ccm-components/resources/menu/menu_bars.css' ],
      style3:       [ ccm.load,      'http://tkless.github.io/ccm-components/resources/menu/menu_content_icons.css' ]
    } ],

    news:           [ ccm.component, '../news/ccm.posts.js', {
      html:         [ ccm.load,      '../news/templates.json' ],
      style:        [ ccm.load,      '../news/style.css' ],
      store:        [ ccm.store,     '../news/datastore.json' ],
      user:         null
    } ],

    quizz:          [ ccm.component, 'http://tkless.github.io/ccm-components/resources/quizz/ccm.quizz.js', {
      html:         [ ccm.load,      'http://tkless.github.io/ccm-components/resources/quizz/quizz_html.json' ],
      store:        [ ccm.store,     'http://tkless.github.io/ccm-components/resources/demoData/we_quizzes.json' ],
      style:        [ ccm.load,      'http://tkless.github.io/ccm-components/resources/quizz/quizz.css' ],
      style_swap:   [ ccm.load,      'http://tkless.github.io/ccm-components/resources/quizz/quizz_swap.css' ],
      lang:         null
    } ],

    rating:         [ ccm.component,  '../thumb_rating/ccm.thumb_rating.js', {
      store:        [ ccm.store, { store: [ ccm.store, './thumb_rating/datastore.json' ] } ],
      style:        [ ccm.load,      '../thumb_rating/style.css' ],
      user:         null
    } ],

    store:          [ ccm.store,     '../demoData/lecture.json'  ],

    style:          [ ccm.load,      '../app/lecture.css' ],

    user:           null,

    video:          [ ccm.component, 'http://tkless.github.io/ccm-components/resources/youtube/ccm.youtube.js', {
      html:         [ ccm.load,      'http://tkless.github.io/ccm-components/resources/youtube/youtube_html.json'],
      store:        [ ccm.store,     'http://tkless.github.io/ccm-components/resources/demoData/we_videos.json' ],
      style:        [ ccm.load,      'http://tkless.github.io/ccm-components/resources/youtube/youtube.css'],
      user:         null } ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.lecture.Lecture
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    // ...

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        // render main html structure
        element.html( ccm.helper.html( self.html.main, {
          fclick: animateFeedback
        } ) );

        renderHeader();
        renderContent();
        renderFeedback();
        renderFooter();

        // perform callback
        if ( callback ) callback();

        function renderHeader( title, click, icon ) {

          ccm.helper.find( self, '.feedback' ).show();

          var header = element.find( '> .view > .header' );

          header.html( ccm.helper.html( self.html.header, {
            pos: ( icon ? '<span class=" fa fa-lg fa-arrow-circle-left"></span>&nbsp;' : '' ) + ( title ? title : self.course ),
            hclick: renderHome,
            pclick: function () { if ( click ) click(); }
          } ) );

          if ( self.user ) self.user.render(); else ccm.helper.find( self, '.user' ).html( '<i>Gast-Modus</i>&nbsp;' );

        }

        function renderContent() {
          var content = element.find( '> .view > .content ' ).html( '' );

          content.html( ccm.helper.html( { class: 'icon' } ) );

          var entries = [];

          for ( var key in dataset.content )
            add( key );

          self.menu.render( {

            element: ccm.helper.find( self, '.icon' ),
            parent: self,
            classes: 'ccm-menu_'+self.layouts[2],
            entries: entries

          }, renderRating );

          function add( key ) {
            addEntry( key, function () { renderPhase( dataset.content[ key ] ) }, dataset.content[ key ].locked, dataset.content[ key ].rating );
          }

          function addEntry( key, click, locked, rating_key ) {

            entries.push( getEntry( dataset.content[ key ].icon, '2x', dataset.content[ key ].label, locked, rating_key, click ) );

          }

        }

        function renderFooter() {

          ccm.helper.find( self, '.footer').html( ccm.helper.html( { inner: { class: 'menu' } } ) );

          var entries = [];

          if ( dataset.news )      addEntry( 'news',function () { renderNews( false ); }  );
          if ( dataset.chat )      addEntry( 'chat',              renderChat );
          if ( dataset.forum )     addEntry( 'forum',             renderForum );
          if ( dataset.dashboard ) addEntry( 'dashboard',         renderDashboard );

          self.menu.render( {

            element: ccm.helper.find( self, '.menu' ),
            parent: self,
            classes: 'ccm-menu_'+ self.layouts[0],
            entries: entries

          }, renderRating );

          function addEntry( entry, click ) {

            if ( dataset[ entry ] ) entries.push( getEntry( dataset[ entry ].icon, '2x', dataset[ entry ].label, undefined, undefined, click ) );

          }

        }

        function renderNews( editable ) {

          var content = element.find( '> .view > .content ' ).html( '' );

          content.html( ccm.helper.html( { class: 'news' } ) );

          renderHeader( editable ? dataset.dashboard.label: dataset.news.label, editable ? function () { renderDashboard(); } : function () { renderNews(); }, editable );

          self.news.render( {

            classes: 'ccm-' + self.layouts[ 3 ],
            element: content.find( '> .news' ),
            key: self.key,
            parent: self,
            editable: editable

          } );

        }

        function animateFeedback() {

          renderFeedback();
          var feedback = ccm.helper.find( self, '.feedback' );
          element.prepend( '<div class="overlay"></div>' );

          feedback.animate( { right: "0px" }, "slow");

          ccm.helper.find( self, feedback, '.button' ).unbind().add( ccm.helper.find( self, '.overlay' ) ).click( function () {
            feedback.animate( { right: "-290px" }, "slow", function () {
              ccm.helper.find( self, '.overlay').remove();
            });
            ccm.helper.find( self, feedback, '.button').unbind().click( animateFeedback );
          } );

        }

        function renderFeedback() {

          self.forms.render( {

            element: ccm.helper.find( self, '.form' ),
            key:     'feedback',
            submit:  saveFeedback,
            parent:  self

          } );

          function saveFeedback( feedback ) {
            var feedback = ccm.helper.find( self, '.form' );

            self.feedback_store.set( feedback, function () {
                feedback.append('Feedback gespeichert. Vielen Dank!');
            });

            return false;

          }

        }

        function renderDashboard() {

          if ( !self.user ) return renderMessage( 'Keine Zugangsberechtigung.' );

          self.user.login( function () {

            var content = element.find( '> .view > .content ' ).html( '' );

            content.html( ccm.helper.html( { class: 'dash' } ) );

            renderHeader( dataset.dashboard.label, renderDashboard );

            var entries = [];

            if ( dataset.dashboard.news  )     addEntry( 'news',   function () { renderNews( true ); } );
            if ( dataset.dashboard.feedbacks ) addEntry( 'feedbacks', renderFeedbacks );
            if ( dataset.dashboard.tasks )     addEntry( 'tasks',  renderTasks );

            self.menu.render( {

              element: content.find( '> .dash' ),
              parent: self,
              classes: 'ccm-menu_'+ self.layouts[2],
              entries: entries

            }, function ( menu ) {
              if ( entries.length === 1 ) ccm.helper.find( menu, '.menu_entry' ).click();
              renderRating( menu );
            } );

            function addEntry( entry, click ) {

              if ( dataset.dashboard[ entry ] && checkAccess() )
                entries.push( getEntry( dataset.dashboard[ entry ].icon, '2x', dataset.dashboard[ entry ].label, undefined, undefined, click ) );

              function checkAccess() {

                return dataset.dashboard[ entry ].role === undefined || !!dataset.tutor[ self.user.data().key ] === dataset.dashboard[ entry ].role;

              }

            }

            function renderFeedbacks() {

              content.html( '' );

              self.feedback_store.get( function ( feedbacks ) {

                for ( var i = 0; i < feedbacks.length; i++ )
                  renderFeedback( feedbacks[ i ] );

                function renderFeedback( feedback ) {

                  content.append( ccm.helper.html( self.html.feedback, {

                    title: feedback.title,
                    kind: {
                      slide: "Fehler in Folien",
                      exercise: "Fehler in Aufgabe",
                      quizz: "Fehler in Quizz",
                      video: "Fehler in Video",
                      bug: "Software-Bug",
                      suggestion: "Verbesserungsvorschlag",
                      spam: "Spam",
                      praise: "Lob",
                      criticism: "Konstruktive Kritik",
                      problem: "Problem",
                      innovation: "Innovationsidee",
                      other: "Sonstiges"
                    }[ feedback.kind ],
                    text: feedback.text

                  } ) );

                }

              } );

            }

            function renderTasks() {

              var content = element.find( '> .view > .content' );

              renderHeader( dataset.dashboard.label, renderDashboard, true );

              self.tasks.render( {
                element: content,
                key: 'we',
                parent:  self
              } );

            }

          } );

        }

        function renderChat() {
          var content = element.find( '> .view > .content ' ).html( '' );

          content.html( ccm.helper.html( { class: 'chat' } ) );

          renderHeader( dataset.chat.label, renderChat );

          self.chat.render( {

            classes: 'ccm-' + self.layouts[ 5 ],
            key: self.key,
            element: content.find( '> .chat' ),
            parent: self

          } );

        }

        function renderHome() {
          renderHeader();
          renderContent();
        }

        function renderPhase( phase ) {

          renderHeader( phase.label, function () { renderPhase( phase ); } );

          element.find( '> .view > .content ' ).html( phase.subtitle );

          var content = element.find( '> .view > .content ' ).html( '' );

          for ( var i = 0; i < phase.units.length; i++ )
            renderUnit( phase.units[ i ] );

          function renderUnit( unit ) {

            content.append( ccm.helper.html( self.html.unit, { label: unit.label } ) );

            var entries = getEntries();

            self.menu.render( {

              classes: 'ccm-menu_' + self.layouts[1],
              element: content.find( '> .parts:last' ),
              entries: entries,
              parent: self

            }, renderRating );

            function getEntries() {

              var entries = [];

              for ( var i = 0; i < unit.parts.length; i++ )
                addPart( unit.parts[ i ] );

              return entries;

              function addPart( part ) {

                var icon = part.icon || part.quizz && dataset.quizz || part.video && dataset.video;

                entries.push( getEntry( icon, 'lg', part.label, part.locked, part.rating, function () { renderPart( part ); } ) );

                function renderPart( part ) {
                  renderHeader( phase.label, function () { renderPhase( phase ); }, true );

                  if ( part.content )        renderContent();
                  if ( part.quizz )          renderQuizz();
                  if ( part.video )          renderVideo();
                  if ( part.link  )          renderLink();
                  if ( part.google_slides )  renderGoogleSlides();
                  if ( part.form  )          renderForm();
                  if ( part.code_trainer  )  renderCodeTrainer();



                  function renderContent() {
                    content.html( ccm.helper.html( { class: 'substance' } ) );
                    var template = self.contents[ part.content ];

                    if ( template.indexOf('%user%') > -1 && self.user )
                      self.user.login( function () { proceed( self.user.data().key ); } );
                    else
                      proceed( 'mmuster2s' );

                    function proceed( user ) {
                      // n - Nutzungvereinbarung, p - Plagiatserklaerung
                      content.find( '> .substance' ).html( ccm.helper.html( template, { user: user, click: function () { agree( part.content === 'nutzungsvereinbarung' ? 'n_agree' : 'p_agree' ); } } ) );

                      function agree( n_or_p ) {

                        if ( self.user ) {

                          renderMessage( 'Bitte loggen Sie sich ein, um Ihre Zustimmung zu bestätigen.' );

                          self.user.login( function () {

                            ccm.helper.loading( content );

                            self.user_store.get( self.key, function ( dataset ) {

                              if ( dataset === null ) self.user_store.set( { key: self.key, users: {} }, proceed ); else proceed( dataset );

                              function proceed( dataset ) {

                                var user = self.user.data().key;

                                if ( !dataset.users[ user ] ) dataset.users[ user ] = {};

                                if ( dataset.users[ user ][ n_or_p ] )
                                  return renderMessage( 'Sie haben bereits zugestimmt.' );

                                dataset.users[ user ][ n_or_p ] = true;
                                self.user_store.set( dataset, function () { renderMessage( 'Ihre Zustimmung wurde erfolgreich gespeichert.' ); } );

                              }

                            } );

                          } );

                        }
                      }

                    }
                  }

                  function renderQuizz() {
                    content.html( ccm.helper.html( { class: 'quizz' } ) );

                    self.quizz.render( {

                      element: content.find( '> .quizz' ),
                      key: part.quizz,
                      onFinish: onFinish

                    } );

                    function onFinish( result ) {

                      showResult( 'Ergebnis', result.correct + ' von ' + result.questions + ' Fragen korrekt beantwortet.' );
                      return false;

                    }

                    function showResult( title, text ) {

                      content.html( ccm.helper.html( self.html.quizz_result, { title: title, text: text, button: 'Neustart', click: renderQuizz } ) );

                    }
                  }

                  function renderVideo() {
                    content.html( ccm.helper.html( { class: 'video' } ) );

                    self.video.render( {

                      element: content.find( '> .video' ),
                      key:     part.video,
                      rating:  false

                    } );
                  }

                  function renderLink() {

                    window.open(part.link,'_blank');

                  }

                  function renderGoogleSlides() {
                    content.html( ccm.helper.html( { class: 'slides' } ) );

                    self.google_slides.render ( {
                      element: content.find( '> .slides' ),
                      embed_code: part.google_slides,
                      title: ''
                    } )
                  }

                  function renderForm(){
                    content.html( ccm.helper.html( { class: 'form' } ) );

                    if ( !self.user ) return renderMessage( 'Im Gast-Modus nicht zugänglich.' );

                    var config = {

                      element: content.find('> .form'),
                      key: part.form,
                      label: part.label
                    };

                    if (part.deadline) config.deadline = part.deadline;
                    if (part.upload_size) config.upload_size = part.upload_size;
                    if (part.upload_time) config.upload_time = part.upload_time;

                    self.form.render( config );
                  }

                  function renderCodeTrainer(){
                    content.html( ccm.helper.html( { class: 'code_trainer' } ) );

                    self.code_trainer.render( {

                      element: content.find( '> .code_trainer' ),
                      key:      part.code_trainer

                    } );
                  }

                }

              }

            }
          }

        }

        function renderForum() {

          renderHeader( dataset.forum.label, renderForum );

          self.forum.render( {

            classes: 'ccm-' + self.layouts[ 4 ],
            element: element.find( '> .view > .content' ),
            key: self.key,
            parent: self

          } );

        }

        function getEntry( icon, size, label, locked, rating_key, click  ) {

          if ( locked === true && self.user && self.user.isLoggedIn() && dataset.tutor[ self.user.data().key ] ) locked = 'unlocked';

          return {
            actions : locked === true ? undefined : click,
            label: ccm.helper.html( self.html.entry, {
              icon:   icon,
              size:   size,
              label:  label,
              lock:   locked ? ' <span class="fa fa-' + ( locked === true ? 'lock' : 'unlock-alt' ) + '"></span>' : '',
              rating: rating_key ? '<div class="thumb_rating noclick">' + rating_key + '</div>' : ''
            } )
          };
        }

        function renderRating( menu ) {

          ccm.helper.find( menu, '.rating' ).each( function () {
            var div = jQuery( this );
            var key = ccm.helper.generateKey();
            div.attr( 'id', key );
            self.rating.render( {
              element: jQuery( '#' + key ),
              key: div.text(),
              mode:  'thumbs',
              parent: self
            } )
          } );

        }

        function renderMessage( text ) {
          var content = element.find( '> .view > .content ' ).html( '' );
          content.html( ccm.helper.html( { class: 'message', inner: text } ) );
        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.lecture
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.lecture.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [lecture dataset]{@link ccm.components.lecture.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [lecture dataset]{@link ccm.components.lecture.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   */

  /**
   * @summary lecture dataset for rendering
   * @typedef {ccm.dataset} ccm.components.lecture.dataset
   * @property {ccm.key} key - dataset key
   */

} );