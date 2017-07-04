/**
 * @overview ccm component for real time  Forum
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = '../libs/ccm.js';

  var component_name = 'realTimeForum';
  var component_obj  = {
    name: component_name,

    config: {
      templates: {
        "main":  {
          "class": "container",
          "inner":
            [
              {
                "id": "questions-list"
              },
              {
                "tag": "hr"
              },
              {
                "tag": "form",
                "onsubmit": "%submit%",
                "inner": [
                  {
                    "id": "new-question-title"
                  },
                  {
                    "id": "editor-container",
                    "inner": [
                      {
                        "id": "form"
                      },
                      {
                        "id": "editor"
                      }
                    ]
                  },
                  {
                    "class": "button row",
                    "inner": {
                      "tag": "button",
                      "class": "btn btn-primary",
                      "type": "submit",
                      "inner": "Post Question"
                    }
                  }
                ]
              }
            ]
        },

        "question": {
          "class": "question",
          "inner": [
            {
              "class": "question-overview",
              "inner": [
                {
                  "class": "vote-sum",
                  "inner": "%votes% votes"
                },
                {
                  "class": "answer_sum",
                  "inner": "%answers% answers"
                }
              ]
            },
            {
              "class": "question-summery bg-info",
              "inner": {
                "class": "question_title",
                "inner": "%title%"
              }
            }
          ]
        },

        "form": {
          "class": "form-horizontal",
          "inner": {
            "class": "form-group",
            "inner":
              [
                {
                  "tag": "label",
                  "class": "control-label col-sm-1",
                  "for": "%for%",
                  "inner": "%inner%"
                },
                {
                  "class": "col-sm-11",
                  "inner": {
                    "tag": "input",
                    "type": "%type%",
                    "class": "form-control",
                    "id":"%id%",
                    "placeholder": "%value%"
                  }
                }
              ]
          }


        }

      },

      data: {
        store: [ 'ccm.store', '../realTimeForum/datastore.json' ],
        key: "demo"
      },
      user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js' ],
      style: [ 'ccm.load', '../realTimeForum/style.css' ],
      editor: [ 'ccm.component', 'https://tkless.github.io/ccm-components/editor/ccm.editor.js' ],
      bootstrap: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' ]
    },

    Instance: function () {
      var self = this;

      this.start = function (callback) {

        self.ccm.helper.dataset(self.data.store, self.data.key, function ( dataset ) {

          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main ), {
            submit: function() {
              alert( "jaa" );
              newPost(); }
          } ));

          renderQuestions();
          renderEditor();

          function renderQuestions() {
            for ( var i = 0; i < dataset.questions.length; i++ ) {
              self.element.querySelector( '#questions-list' ).appendChild( self.ccm.helper.html( self.templates.question, {
                title: dataset.questions[i].title,
                votes: i,
                answers: dataset.questions[i].answers.length
              } ) );
            }
          }

          function renderEditor() {
            self.element.querySelector( '#new-question-title' ).appendChild( self.ccm.helper.html( self.templates.form, {
              for:   "title",
              inner: "Title",
              id:    "title",
              type:  "text",
              value: "What is your Question ?"
            } ));

            self.element.querySelector( '#form' ).appendChild( self.ccm.helper.html( self.templates.form, {
              for:   "question",
              inner: "",
              id:    "question",
              type:  "hidden",
              value: ""
            } ));

            self.editor.start( { element: self.element.querySelector( '#editor' ) } );
          }

          function newPost() {
            if ( !self.user ) return;

            if ( !self.user.isLoggedIn() ) {

              self.user.login ( function () {
                var question_title = self.element.querySelector( 'input[id = title ]' ).value;

                console.log( 'huhu', question_title );
              } );
            }
          }

          if ( callback ) callback();

        } );
      };
    }
  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );
