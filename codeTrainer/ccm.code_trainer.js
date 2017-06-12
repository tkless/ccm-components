/**
 * @overview <i>ccm</i> component for code trainer
 * @author Tea Kless <tea.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.component( {
  name: 'code_trainer',
  config: {

    html:   [ ccm.load, '../codeTrainer/code_trainer_html.json' ],
    key:    'demo',
    store:  [ ccm.store, '../codeTrainer/code_trainer.json' ],
    style:  [ ccm.load, '../codeTrainer/code_trainer.css' ],
    editor: [ ccm.instance, '../codeEditor/ccm.editor.js'],
    onFinish: function ( code_trainer ) { code_trainer.render(); },
    standalone: true

  },

  Instance: function () {
    var self = this;

    this.init = function ( callback ) {


      if( self.editor ){
        self.editor.element = self.element.find( '.content > .editor > .code' );
      }
      // perform callback
      callback();

    };

    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );


      console.log( self.editor );

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        element.html( ccm.helper.html( self.html.main, { title: dataset.title  } ) );

        if ( !self.standalone ) {
          element.find( '.header' ).remove();
          element.find( '.footer').remove();
        }

        renderTask( dataset.tasks[ 0 ], 0 );

        // translate own content
        if ( self.lang ) self.lang.render();

        // perform callback
        if ( callback ) callback();

        function renderTask( task, i ) {

          ccm.helper.find( self, '.content' ).html( ccm.helper.html ( self.html.task, {

            title: task.title,
            text: task.text,
            click: function () {
              if ( i < dataset.tasks.length - 1 )
                renderTask( dataset.tasks[ i + 1 ], i + 1 );
              else {
                self.onFinish(self);
              }
            },
            input: function () {

              var preview = ccm.helper.find ( self, '.result');

              console.log(preview);
              preview.html( self.editor.getValue() );
              self.editor.getSession().on('change', function() {
                preview.html( self.editor.getValue() );
              });


              ccm.helper.find( self, '.result' ).html( jQuery( this ).text() );

            }

          } ) );

          if( self.editor ) self.editor.render();


          ccm.helper.find( self, '.code' ).click( function () {
            ccm.helper.find( self, jQuery( this ), '.editable' ).focus();
          } );
        }

      } );

    };

  }

} );