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
        "main": {
          "id": "questions-list",
          "inner": [
            {
              "tag": "div",
              "id": "question-overview"
            },
            {
              "tag": "div",
              "id": "question-summery",
              "class": "bg-warning"
            },
            {
              "id": "editor"
            }
          ]
        },

        "question": {
          "tag": "div",
          "class": "question_title",
          "inner": "%title%"
        }
      },

      data: {
        store: [ 'ccm.store', '../realTimeForum/datastore.json' ],
        key: "demo"
      },
      style: [ 'ccm.load', '../realTimeForum/style.css' ],
      editor: [ 'ccm.instance', 'https://tkless.github.io/ccm-components/editor/editor.js' ],
      bootstrap: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' ]
    },

    Instance: function () {
      var self = this;

      this.start = function (callback) {

        self.ccm.helper.dataset(self.data.store, self.data.key, function (dataset) {

          self.ccm.helper.setContent(self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main ) ));

          for ( var i = 0; i < dataset.questions.length; i++ ) {
            self.element.querySelector( "#question-summery" ).appendChild( self.ccm.helper.html( self.templates.question, {
              title: dataset.questions[i].title
            } ) );
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
