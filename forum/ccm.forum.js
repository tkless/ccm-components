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
      var element;
      var qa_dataset;
      var unanswered_only;
      var focused_question;
      var checked_answer;

      this.init = function ( callback ) {

        // listen to the change event of the ccm realtime datastore for question and answers
        self.store.onChange = update;

        //ToDo
        // set website area for user login
        //if ( self.user ) self.user.element = self.element.find( 'div.qa_user' );

        // perform callback
        if ( callback ) callback();

      };

      this.ready = function ( callback ) {

        // listen to login and logout event of user instance
        if ( self.user ) self.user.addObserver( function () {

          //ToDo
          // website area for own content no more exists in DOM? => abort
          //if ( !ccm.helper.isInDOM( self ) ) return;

          update();

        } );

        // perform callback
        if ( callback ) callback();

      };

      this.start = function ( callback ) {

        // get dataset for questions and answers
        self.data.store.get( self.data.key, function ( dataset ) {

          // dataset not exists? => create new dataset for questions and answers
          if ( !dataset ) self.data.store.set( { key: self.data.key, questions: [] }, proceed ); else proceed( dataset );

          function proceed( dataset ) {

            // remember current dataset for questions and answers
            qa_dataset = dataset;

            // render questions view
            renderQuestionsView();

            // render user login
            if ( self.user ) { self.element.prepend( '<div class="qa_user"></div>' ); self.user.render(); }

            // perform callback
            if ( callback ) callback();

          }

        } );

      };

      function update() {

        // get dataset for questions and answers
        self.store.get( self.key, function ( dataset ) {

          // remember current dataset for questions and answers
          qa_dataset = dataset;

          // current view is questions view? => (re)render questions
          if ( isQuestionsView() ) renderQuestions();

          // current view is question answers view
          else {

            // (re)render focused question
            renderFocusedQuestion( focused_question );

            // (re)render answers
            renderAnswers( focused_question );

          }

        } );

      }

      function renderQuestionsView() {

        // create questions view inner website areas
        element.html(

            '<div class="qa_navigation"></div>' +
            '<div class="qa_questions_view"></div>' +
            '<div class="qa_new"></div>'

        );

        // render navigation buttons
        renderNavigation( unanswered_only, !unanswered_only );

        // render questions
        renderQuestions();

        // user instance exists? => render website area for creating a new question
        if ( self.user ) renderNew();

        // use multilingualism? => translate content of own website area
        if ( self.lang ) self.lang.render();

      }

      function renderQuestions() {

        // clear website area for questions in questions view
        element.find( 'div.qa_questions_view' ).html( '' );

        // render questions
        for ( var i = 0; i < qa_dataset.questions.length; i++ )
            if ( !unanswered_only || !qa_dataset.questions[ i ].answers.length )
                renderQuestion( qa_dataset.questions[ i ], i );

        // use multilingualism? => translate content of questions view
        if ( self.lang ) self.lang.render( 'div.qa_questions_view' );

        function renderQuestion( question, i ) {
          var question_div = jQuery(

            '<div class="qa_questions_view_entry">' +
            '<div class="qa_questions_view_left">' +
            '<div class="qa_questions_view_rating" title="lang#rating_title">' + ccm.helper.htmlEncode( question.rating ) + '<br>' + ( question.rating === 1 ? 'vote' : 'votes' ) + '</div>' +
            '<div class="qa_questions_view_answers" title="lang#answers_title">' + question.answers.length + '<br>' + ( question.answers.length === 1 ? 'answer' : 'answers' ) + '</div>' +
            '</div>' +
            '<div class="qa_questions_view_right">' +
            '<div class="qa_questions_view_title">' + ccm.helper.htmlEncode( question.title ) + '</div>' +
            renderSignature( question ) +
            '</div>' +
            '</div>'

          );

          // set question click event => render answers view
          question_div.find( 'div.qa_questions_view_right' ).click( function () {

            // remember focused question dataset index
            focused_question = i;

            // log event
            if ( self.bigdata ) self.bigdata.log( 'clickQuestion', { key: self.key, question: focused_question } );

            // render website area for answers view in website area for own content
            renderAnswersView();

          } );

          // prepend website area for the question to website area for questions view
          element.find( 'div.qa_questions_view' ).prepend( question_div );

          }

      }

      function renderAnswersView() {
        var question = qa_dataset.questions[ focused_question ];

        // create answers view inner website areas
        element.html(

            '<div class="qa_navigation"></div>' +
            '<div class="qa_answers_view">' +
            '<div class="qa_answers_view_question_entry"></div>' +
            '<div class="qa_answers_view_answers"></div>' +
            '</div>' +
            '<div class="qa_new"></div>'

        );

        // render navigation buttons
        renderNavigation( true, true );

        // render focused question
        renderFocusedQuestion();

        // render answers
        renderAnswers();

        // user instance exists and user is not question creator? => render website area for creating a new answer
        if ( self.user ) renderNew( question );

        // use multilingualism? => translate content of own website area
        if ( self.lang ) self.lang.render();

      }

      function renderNavigation( all_questions, unanswered ) {

        if ( qa_dataset.questions.length > 0 ) {
            // render navigation buttons
            element.find('div.qa_navigation').html(
                ( all_questions ? '<div class="qa_all_questions"><button>' + ( self.lang ? 'lang#all_questions_button' : 'Alle Fragen' ) + '</button></div>' : '' ) +
                ( unanswered ? '<div class="qa_unanswered"><button>' + ( self.lang ? 'lang#unanswered_button' : 'Unbeantwortete' ) + ' </button></div>' : '' )
            );
        }

        // set 'All Questions' button click event => render questions view
        if ( all_questions ) element.find( 'div.qa_all_questions button' ).click( function () { unanswered_only = false; renderQuestionsView() } );

        // set 'Unanswered' button click event => render questions view with unanswered questions only
        if ( unanswered ) element.find( 'div.qa_unanswered button' ).click( function () { unanswered_only = true; renderQuestionsView(); } );

      }

      function renderFocusedQuestion() {
        var question = qa_dataset.questions[ focused_question ];
        var question_div = element.find( 'div.qa_answers_view_question_entry' ).html(
            '<div class="qa_answers_view_question_title">' + ccm.helper.htmlEncode( question.title ) + '</div>&nbsp;' +
            '<div class="qa_answers_view_question_entry_content">' +
            '<div class="qa_voting"></div>' +
            '<div class="qa_answers_view_question">' +

            '<div class="qa_answers_view_question_content">' + ccm.helper.noScript( question.content ) + '</div>' +
            renderSignature( question ) +
            '</div>'+

            '</div>'+
            ( qa_dataset.questions[ focused_question].answers.length > 0 ? '<div><hr></div>' : '' )


        );

        // render voting area
        renderVoting( question_div.find( 'div.qa_voting' ), question );

      }

      function renderAnswers() {
        var question = qa_dataset.questions[ focused_question ];

        // clear website area for answers in answers view
        element.find( 'div.qa_answers_view_answers' ).html( '' );

        // render answers
        for ( var i = 0; i < question.answers.length; i++ )
            renderAnswer( question.answers[ i ] );

        function renderAnswer( answer ) {
          var answer_div = jQuery(

              '<div class="qa_answers_view_answer_entry">' +
              '<div class="qa_answers_view_answer_entry_content">' +
              '<div class="qa_voting"></div>' +
              '<div class="qa_answers_view_answer">' +
              '<div class="qa_answers_view_answer_content">'+ ccm.helper.noScript( answer.content ) + '</div>' +
              renderSignature( answer ) +
              '</div>' +
              '</div>' +
              '</div>'

          );

          // render voting area
          renderVoting( answer_div.find( 'div.qa_voting' ), answer );

          // prepend website area for answer to website area for answers in answers view
          element.find( 'div.qa_answers_view_answers' ).prepend( answer_div );

        }

      }

      function renderSignature( dataset ) {
        return '<div class="qa_signature"><div title="lang#user_title">' + ccm.helper.htmlEncode( dataset.user ) + '</div>&nbsp;<div title="lang#date_title">['+ ccm.helper.htmlEncode( dataset.date ) + ']</div></div>';

      }

      function renderVoting( voting_div, dataset ) {

        // render content of voting area
        voting_div.html(

            '<div class="qa_vote_up" title="lang#vote_up_title"></div>' +
            '<div class="qa_rating" title="lang#rating_title">' + ccm.helper.htmlEncode( dataset.rating ) + '</div>' +
            '<div class="qa_vote_down" title="lang#vote_down_title"></div>'

        );

        // is voting for answer? => render check mark
        if ( voting_div.parent().hasClass( 'qa_answers_view_answer_entry' ) ) renderCheckMark();

        // user cannot vote? => prevent voting
        if ( !votingAllowed() ) return preventVoting();

        // set vote up click event
        voting_div.find( 'div.qa_vote_up' ).click( function () { vote( true ); } );

        // set vote down click event
        voting_div.find( 'div.qa_vote_down' ).click( function () { vote( false ) } );

        // use multilingualism? => translate content of voting area
        if ( self.lang ) self.lang.render( 'div.qa_voting' );


        function renderCheckMark() {
          var question = qa_dataset.questions[ focused_question ];

          // answer has no bounty and user is not question creator? => abort
          if ( !dataset.bounty && ( !self.user || self.user.data().key !== question.user ) ) return;
          var check_mark = jQuery( '<div class="qa_check_mark' + ( dataset.bounty ? ' qa_check_mark_selected' : '' ) + '" title="lang#check_mark_title">&#x2714</div>' );

          // remember current checked answer
          if ( dataset.bounty ) checked_answer = dataset;

          // set check mark click event
          check_mark.click( function () {

            // forget previous checked answer
            if ( checked_answer ) checked_answer.bounty = false;

            // check clicked answer
            dataset.bounty = true;

            // remember current checked answer
            checked_answer = dataset;

            // update dataset for question and answers
            self.store.set( qa_dataset, update );

            // log event
            if ( self.bigdata ) self.bigdata.log( 'clickCheckMark', { key: self.key, question: focused_question, dataset: dataset } );

          } );

          // append check mark to website area for voting
          voting_div.append( check_mark );

        }

        function votingAllowed() {

          // no user? => voting not allowed
          if ( !self.user ) return false;

          // user is not logged in? => voting allowed
          if ( !self.user.isLoggedIn() ) return true;

          // user is creator? => voting not allowed
          if ( self.user.data().key === dataset.user ) return false;

          // user has already voted? => voting not allowed
          if ( dataset.voted_users[ self.user.data().key ] !== undefined ) return false;

          // voting allowed
          return true;

        }

        function preventVoting() {

          voting_div.find( 'div[class^="qa_vote_"]' ).addClass( 'qa_vote_hidden' ).unbind().attr( 'title', '' );

        }

        function vote( up_or_down ) {

          // prevent another voting
          preventVoting();

          // login user if not logged in
          self.user.login( function () {

              // user cannot vote? => abort
              if ( !votingAllowed() ) return;

              // vote up or down
              up_or_down ? dataset.rating++ : dataset.rating--;

              // remember that user has already voted
              dataset.voted_users[ self.user.data().key ] = up_or_down;

              // is voting for answer? => reorder answers (in best voted order)
              if ( voting_div.parent().hasClass( 'qa_answers_view_answer_entry' ) )
                  qa_dataset.questions[ focused_question ].answers.sort( compare );

              // update dataset for question and answers
              self.store.set( qa_dataset, update );

              // log event
              if ( self.bigdata ) self.bigdata.log( 'clickVote', { key: self.key, question: focused_question, dataset: dataset } );


              function compare( a, b ) {
                  if (a.rating < b.rating )
                      return -1;
                  if (a.rating > b.rating )
                      return 1;
                  return 0;
              }

          } );

        }

      }

      function renderNew() {
        var new_div = element.find( 'div.qa_new' ).html(

            '<div><hr></div>&nbsp;' +

            ( isQuestionsView() ?
                '<div class="qa_new_question">' +
                '<div><label>lang#title</label>:&nbsp;</div>' +
                '<div class="qa_new_question_title">' +
                '<form action="javascript:void(0);"><input type="text" required placeholder="lang#title_placeholder"></form>' +
                '</div>' +
                '</div>'
                : '' ) +
            '<div class="qa_editor"></div>' +
            '<div><button class="qa_post">lang#post_button</button></div>'

        );

        // activate jQuery text editor
        new_div.find( 'div.qa_editor' ).jqte({
          sub:    false, strike: false, rule:   false,
          sup:    false, color:  false, left:   false,
          right:  false, center: false, fsize:  false,
          unlink: false, source: false, remove: false,

          formats: [
              ["p","Standard "], ["h1","Head 1"], ["h2","Head 2"],
              ["h3","Head 3"], ["h4","Head 4"],["h4","Head 4"]
          ]
        });

        // set post button click event
        new_div.find( 'button.qa_post' ).click( function () {

          // TODO: text area for title (empty? to small? validation?)

          // no content in text editor? => abort
          if ( !new_div.find( '.jqte_editor' ).text().trim().length ) return;

          // login user if not logged in
          self.user.login( function () {

              // create question or answer
              if ( isQuestionsView() ) createQuestion(); else createAnswer();

              // (re)render website area for creating new question or answer
              renderNew();

          } );


          function createQuestion() {
              var dataset = {

                  date: getDateTime(),
                  user: self.user.data().key,
                  title: new_div.find( 'input' ).val(),
                  content: new_div.find( '.jqte_editor' ).html(),
                  rating: 0,
                  voted_users: {},
                  answers: []

              };

              // log event
              if ( self.bigdata ) self.bigdata.log( 'createQuestion', { key: self.key, title: dataset.title, content: dataset.content } );

              // add new question dataset to the others
              qa_dataset.questions.push( dataset );

              // update dataset for questions and answers
              self.store.set( qa_dataset, update );

          }

          function createAnswer() {
              var question = qa_dataset.questions[ focused_question ];
              var dataset = {

                  date: getDateTime(),
                  user: self.user.data().key,
                  content: new_div.find( '.jqte_editor' ).html(),
                  rating: 0,
                  voted_users: {}

              };

              // log event
              if ( self.bigdata ) self.bigdata.log( 'createAnswer', { key: self.key, question: focused_question, content: dataset.content } );

              // add new question answer dataset to the others (in best voted order)
              if ( !question.answers.length )
                  question.answers.push( dataset );
              else
                  for ( var i = 0; i < question.answers.length; i++ )
                      if( question.answers[ i ].rating >= 0 ) {
                          question.answers.splice( i, 0, dataset);
                          break;
                      }

              // update dataset for questions and answers
              self.store.set( qa_dataset, update );

          }

          function getDateTime() {

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

        } );

        // use multilingualism? => translate content of website area for creating new question or answer
        if ( self.lang ) self.lang.render( 'div.qa_new' );

      }

      function isQuestionsView() {

        return ccm.helper.tagExists( self.element.find( 'div.qa_questions_view' ) );

      }

    }
  };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );