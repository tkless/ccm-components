/**
 * @overview ccm component for commenting
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'comment',
    version: [ 1,0,0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-11.5.0.min.js',
      integrity: 'sha384-7lrORUPPd2raLsrPJYo0Arz8csPcGzgyNbKOr9Rx3k0ECU0T8BP+B1ejo8+wmUzh',
      crossorigin: 'anonymous'
    },

    config: {
      templates: {
        "main": {
          "class": "container-fluid",
          "inner": [
            {
              "tag": "h3",
              "class": "row text-success",
              "inner": "Comments"
            },
            {
              "id": "comment-list",
              "class": "row"
            },
            {
              "tag": "form",
              "class": "row",
              "inner": [
                {
                  "id": "new-comment",
                  "inner": [
                    {
                      "tag": "button",
                      "type": "button",
                      "class": "btn btn-default btn-xs",
                      "onclick": "%render_editor%",
                      "inner": [
                        {
                          "tag": "span",
                          "class": "glyphicon glyphicon-plus-sign",
                          "aria-hidden": "true"
                        },
                        "&nbsp;add comment"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        "editor":{
          "class": "row",
          "inner": [
            {
              "class": "form-group",
              "inner":
                {
                  "class": "container-fluid",
                  "id": "editor"
                }
            },
            {
              "id": "add-comment",
              "inner": [
                {
                  "tag": "button",
                  "type": "button",
                  "class": "btn btn-default btn-xs",
                  "onclick": "%add_comment%",
                  "inner": "&nbsp;add comment"
                }
              ]
            }
          ]
        },
        "voting_overview": {
          "class": "voting_overview row",
          "inner": [
            {
              "class": "col-md-12",
              "inner": "%get_voting%"
            },
            {
              "class": "col-md-12",
              "inner": "votes"
            }
          ]
        },
        "simple_comment": {
          "inner": [
            {
              "class": "row comment-item",
              "inner": [
                {
                  "class": "col-md-1 col-xs-1 voting-area"
                },
                {
                  "class": "col-md-11 col-xs-11 comment-overview",
                  "inner": [
                    "%comment_content%&nbsp;",
                    {
                      "tag": "span",
                      "class": "sub-text",
                      "inner": [
                        {
                          "tag": "span",
                          "class": "glyphicon glyphicon-minus",
                          "aria-hidden": "true"
                        },
                        "&nbsp;",
                        {
                          "tag": "span",
                          "class": "glyphicon glyphicon-user",
                          "aria-hidden": "true"
                        },
                        "&nbsp;%user%&nbsp;",
                        {
                          "tag": "span",
                          "class": "glyphicon glyphicon-time",
                          "aria-hidden": "true"
                        },
                        "&nbsp;%date%&nbsp;"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "tag": "hr",
              "class": "row"
            }
          ]
        },
        "expanded_comment": {
          "inner": {
              "class": "panel panel-white post panel-shadow",
              "inner": [
                {
                  "class": "post-heading",
                  "inner":[
                    {
                      "class": "pull-left image",
                      "inner": {
                        "tag": "img",
                        "src": "https://tkless.github.io/ccm-components/comment/resources/user.jpg",
                        "class": "img-circle avatar",
                        "alt": "user profile image"
                      }
                    },
                    {
                      "class": "pull-left meta",
                      "inner": [
                        {
                          "class": "title h5",
                          "inner": "<b>%user%</b>&nbsp;made a post."
                        },
                        {
                          "tag": "h6",
                          "class": "text-muted time",
                          "inner": "%date%"
                        }
                      ]
                    }
                  ]
                },
                {
                  "class": "post-description",
                  "inner": [
                    {
                      "tag": "p",
                      "class": "comment-overview",
                      "inner": "%comment_content%&nbsp;"
                    },
                    {
                      "class": "stats voting-area"
                    }
                  ]
                }
              ]
            }
        },
        "edit": {
          "tag": "span",
          "type": "btn",
          "class": "btn",
          "onclick": "%edit%",
          "inner": [
            {
              "class": "glyphicon glyphicon-pencil"
            },
            "&nbsp;Edit&nbsp;",
          ]
        }
      },
      data: { store: [ "ccm.store", {} ], key: 'demo' },
      editor: [ 'ccm.component', 'https://tkless.github.io/ccm-components/editor/versions/ccm.editor-2.0.0.js',
        { 'settings.modules.toolbar': false },
        { 'settings.placeholder': 'Write your comment here ...' }
      ],
      libs: [ 'ccm.load',
        { context: 'head', url: 'https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css' },
        'https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css',
        'https://tkless.github.io/ccm-components/comment/resources/default.css',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js'
      ]
    },

    Instance: function () {
      var self = this;
      var editor;
      var dataset;

      this.init = function ( callback ) {

        // listen to change event of ccm realtime datastore => (re)render own content
        if ( self.data.store ) self.data.store.onChange = function ( comment ) {
          dataset = comment;
          self.start();
        };

        callback();
      };

      this.ready = function ( callback ) {
        if ( self.user )
          self.user.addObserver( self.index, function ( event ) {
          if ( event) self.start();
        });

        if ( self.logger ) self.logger.log( 'ready', {
          key: self.data.key,
          store: self.data.store.source()
        } );
        callback();
      };

      this.start = function ( callback ) {

        self.ccm.helper.dataset( self.data.store, self.data.key, function ( dataset ) {
          if ( self.logger )
            self.logger.log( 'start', dataset );

          if ( !dataset.comments ) dataset.comments = [];

           var main_elem = self.ccm.helper.html( self.templates.main, {
            render_editor: function () {
              self.element.querySelector( '#new-comment' ).classList.add( 'fade-comment' );
              renderEditor();
            }
          } );

          renderComments();

          function renderComments() {
            var unsorted_comments = [];

            main_elem.querySelector( '#comment-list' ).innerHTML = '';

            var counter = 1;
            //asynchronous problem
            dataset.comments.map( renderComment );
            check();

            // waiting: all comments and their voting ist put in on-the-fly object
            function check() {
              counter--;
              if( counter > 0 ) return;

              if ( self.sorting_by_voting )
                unsorted_comments.sort( compare );

              unsorted_comments.map( function ( entry ) {
                // prepend element to DOM
                self.ccm.helper.prepend( main_elem.querySelector( '#comment-list' ), entry.comment );
              });

              self.ccm.helper.setContent( self.element, main_elem );
              if ( callback ) callback();

              function compare( a, b ) {
                if ( a.voting < b.voting )
                  return -1;
                if ( a.voting > b.voting )
                  return 1;
                return a.date.localeCompare( b.date );
              }

            }

            function renderComment( comment ) {
              var old_comment = comment.content;
              var comment_elem;

              if( self.comment_template === 'expanded' ) {
                // generate on-the-fly element
                comment_elem = self.ccm.helper.html( self.templates.expanded_comment, {
                  comment_content: comment.content,
                  user: comment.user,
                  date: moment( comment.date ).fromNow()
                });
              }
              else
                comment_elem = self.ccm.helper.html( self.templates.simple_comment, {
                  comment_content: comment.content,
                  user: comment.user,
                  date: moment( comment.date ).fromNow()
                });

              if ( self.editable ) {

                var edit_elem = self.ccm.helper.html( self.templates.edit, {
                  edit: function () {

                   var content = comment_elem.querySelector( '.comment-overview' ).childNodes[0].textContent;
                    self.editor.start( function (instance) {
                      self.ccm.helper.setContent( comment_elem.querySelector( '.comment-overview' ), instance.root );
                      instance.get().setText( content );
                      instance.get().focus();
                      instance.element.querySelector( '.ql-editor' ).addEventListener( 'blur', function () {
                        comment.content = instance.get().getText().trim();
                        dataset.comments[ comment ] =
                          {
                            "user": comment.user,
                            "date": comment.date,
                            "content": comment.content,
                            "voting": comment.voting
                          };

                        // update dataset for rendering => (re)render accepted answer
                        self.data.store.set( dataset, function () {
                          self.start();
                          if( self.logger ) self.logger.log( 'edit', { 'old': old_comment, 'new': comment.content });
                        } );
                      } );
                    } );
                  }
                } );

                if ( self.user && self.user.isLoggedIn() && ( self.user.data().name === comment.user ) ) {
                  comment_elem.querySelector( '.comment-overview' ).appendChild( edit_elem );
                }
              }

              //if voting is set then render voting-component
              if ( self.voting )
                renderVoting( comment.voting );
              else {
                unsorted_comments.push( { "comment": comment_elem, "date": comment.date } );
                comment_elem.querySelector( '.voting-area' ).remove();
                comment_elem.querySelector( '.comment-overview' ).classList.remove( 'col-md-11' );
                comment_elem.querySelector( '.comment-overview' ).classList.add( 'col-md-12' );
              }

              function renderVoting( voting ) {

                counter++;

                voting = {
                  'data.key': voting,
                  onvote: function ( event ) { return event.user !== comment.user; }
                };

                if ( self.user && self.user.isLoggedIn() && ( comment.user === self.user.data().name ) )
                  voting.user = '';

                self.voting.start( voting, function ( voting_inst ) {
                  // fill array for sorting
                  unsorted_comments.push( { "voting": voting_inst.getValue(), "comment": comment_elem, "date": comment.date } );
                  comment_elem.querySelector( '.voting-area' ).appendChild( voting_inst.root );
                  check();
                } );
              }
            }
          }

          function renderEditor() {
            if ( !self.user ) return;

            self.element.querySelector( '#new-comment' ).innerHTML = '';

            var editor_elem = self.ccm.helper.html( self.templates.editor, {
              add_comment: function () {
                self.user.login( function () { newComment(); } );
              }
            });

            self.editor.start( function ( instance ) {
              editor_elem.querySelector( '#editor' ).appendChild( instance.root );
              editor = instance
            } );

            self.element.querySelector( '#new-comment' ).appendChild( editor_elem );
          }
          
          function newComment() {
            var data = {
              "user": self.user.data().name,
              "date": moment().format(),
              "content": editor.get().getText().trim(),
              "voting": dataset.key + '_' + ( dataset.comments.length + 1 )
            };

            dataset.comments.push( data );
            // update dataset for rendering => (re)render accepted answer
            self.data.store.set( dataset, function () {
              self.start();
              if ( self.logger ) {
                data = self.ccm.helper.clone( data );
                delete dataset.user;
                self.logger.log( 'create', data );
              }
            } );
          }

        } );
      };
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );