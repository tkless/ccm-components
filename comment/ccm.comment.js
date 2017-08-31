/**
 * @overview ccm component for commenting
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'comment',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      templates: {
        "main": {
          "key": "main",
          "class": "main",
          "inner": [
            { "class": "comments" },
            { "class": "editor" },
            {
              "class": "button",
              "inner": {
                "tag": "button",
                "onclick": "%click%",
                "inner": "%label%"
              }
            }
          ]
        },
        "comment": {
          "key": "comment",
          "class": "comment",
          "inner": [
            {
              "class": "head",
              "inner": [
                {
                  "class": "user",
                  "inner": [
                    { "class": "avatar" },
                    { "class": "name" }
                  ]
                },
                { "class": "date" }
              ]
            },
            {
              "class": "body",
              "inner": [
                { "class": "content" }
              ]
            }
          ]
        }
      },
      data: {
        store: [ 'ccm.store', '../comment/datastore.json' ],
        key: 'test'
      },
      user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js', { logged_in: true, 'guest.user': 'tmeskh2s' } ],
      editor: [ 'ccm.component', '../editor/ccm.editor.js' ]
    },

    Instance: function () {
      var self = this;

      this.start = function ( callback ) {

        self.ccm.helper.dataset( self.data.store, self.data.key, function ( dataset ) {
          if ( !dataset.comments ) dataset.comments = [];

          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( self.templates.main, {
            click: function () {
              console.log( 'click!', self.editor.get().getContents() );
            },
            label: 'send'
          } ) ) );

          renderEditor();

          function renderEditor() {
            if (!self.user || !self.user.isLoggedIn()) return;

            var user = self.user.data().user;

            self.editor.start( { root: self.element.querySelector( '.editor' ) }, function (instance) {
              if (user !== dataset.user) {
                editor = instance;
              }
              else {
                editor = instance;
                editor.get().enable( false );
              }
            } );
          }

        } );
      };
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );