/**
 * @overview ccm component for real time  Forum
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.js';

  var component_name = 'forum';
  var component_obj  = {
    name: component_name,

    config: {
      templates: {
        "main": {
          "inner": [
            {
              "id": "questions_view",
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
            {
              "id": "answers_view",
              "class": "container"
            }
          ]
        },

        "question": {
          "class": "question row",
          "inner": [
            {
              "class": "question-overview col-md-2 text-center",
              "inner":
                [
                  {
                    "class": "row",
                    "inner": [
                      {
                        "class": "vote-sum col-md-6 col-xs-6",
                        "inner": "%votes%"
                      },
                      {
                        "class": "answer_sum col-md-6 col-xs-6",
                        "inner": "%answers%"
                      }
                    ]
                  },
                  {
                    "class": "row",
                    "inner": [
                      {
                        "class": "vote-label col-md-6 col-xs-6",
                        "inner": "votes"
                      },
                      {
                        "class": "vote-label col-md-6 col-xs-6",
                        "inner": "answers"
                      }
                    ]
                  }
                ]
            },
            {
              "class": "question-summery col-md-10",
              "inner": {
                "tag": "blockquote",
                "inner":[
                  {
                    "tag": "p",
                    "class": "question_title",
                    "inner": "%title%"
                  },
                  {
                    "tag": "footer",
                    "class": "question_footer",
                    "inner": "%signatur%"
                  }
                ]
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
        store: [ 'ccm.store', '../forum/datastore.json' ],
        key: "demo"
      },
      user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js' ],
      style: [ 'ccm.load', '../forum/style.css' ],
      editor: [ 'ccm.component', 'https://tkless.github.io/ccm-components/editor/ccm.editor.js',
        { 'settings.modules.toolbar': [
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            ['bold', 'italic', 'underline'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }]
        ] }
      ],
      voting: [ "ccm.component", "https://tkless.github.io/ccm-components/voting/ccm.voting.js", { data:
        { store: 'https://tkless.github.io/ccm-components/voting/voting_datastore.js' } } ],
      bootstrap: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' ]
    },

    Instance: function () {
      var self = this;
      var editor;

      this.start = function (callback) {

        self.ccm.helper.dataset(self.data.store, self.data.key, function ( dataset ) {

          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main, {
            submit: function ( event ) { event.preventDefault(); newPost(); }
          } ) ) );

          renderQuestions();
          renderEditor();

          function renderQuestions() {

            var voting;
            for ( var i = 0; i < dataset.questions.length; i++ ) {
              //voting = self.voting.instance( { data: dataset.questions[ i ] } );
              console.log(self.voting);
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

            self.editor.start( { element: self.element.querySelector( '#editor' ) }, function ( instance ) {
              editor = instance;
            } );
          }

          function newQuestion() {
            if ( !self.user ) return;

            self.user.login ( function () {
              console.log( editor.get() );
              var question_title = self.element.querySelector( 'input[id = title ]' ).value;

              console.log( editor.get().getContents() );
            } );
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
