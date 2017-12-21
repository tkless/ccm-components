/**
 * @overview ccm component for saving given files as data in ccm datasore
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'file_upload',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      templates: {
        "file_upload": {
          "class": "container",
          "inner": {
            "tag": "form",
            "id": "box",
            "onclick": "%trigger_dialog%",
            "inner": [
              {
                "class": "box-input",
                "inner":
                  {
                    "tag" : "span",
                    "inner": [
                      {
                        "tag": "span",
                        "class": "glyphicon glyphicon-cloud-upload"
                      },
                      {
                        "tag": "strong",
                        "inner": "Choose a file",
                      },
                      {
                        "tag": "span",
                        "class":"box-dragndrop",
                        "inner": " or drag it here."
                      },
                    ]
                  }
              },
              { "id": "space" },
              {
                "id": "button",
                "inner": {
                  "tag": "button",
                  "class": "btn btn-info btn-lg box-button",
                  "onclick": "%submit%",
                  "inner": "Upload"
                }
              }
            ]
          }
        },

        "preview": {
          "class": "preview",
          "inner": [
            {
              "class": "box-image"
            },
            {
              "class": "box-details",
              "inner":
                {
                  "class": "box-filename",
                  "inner": {
                    "tag": "span",
                    "class": "name"
                  }
                }
            },
            {
              "class": "box-progress"
            }
          ]
        }

      },
      data: { store: [ 'ccm.store' ], key: 'demo' },
      libs: [ 'ccm.load',
       { context: 'head', url: '../../ccm-components/lib/bootstrap/css/font-face.css' },
        '../../ccm-components/lib/bootstrap/css/bootstrap.css',
        '../file-upload/resources/default.css'
      ]
    },

    Instance: function () {
      let self = this;
      let filePaths = [];

      this.ready = callback => {
        $ = this.ccm.helper;
        callback();
      };

      this.start = callback  => {
        let files_data = {
          slides: []
        };

        $.setContent( this.element, $.html( this.templates.file_upload , {
          trigger_dialog: () => input.click(),
          submit: event => {
            event.preventDefault();
            event.stopPropagation();

            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              // update dataset
              self.data.store.set( files_data, () => {

                if ( self.logger ) {
                  files_data = $.clone( files_data );
                  self.logger.log( 'create', files_data );
                }

                var feedback = document.createElement( 'feedback' );
                feedback.classList.add( 'text-primary' );
                feedback.innerHTML = "&nbsp;Saved <span class='glyphicon glyphicon-saved'></span>";
                self.element.querySelector( '#space' ).appendChild( feedback );
                self.element.querySelector( '#space' ).style.height = 100;



                self.element.querySelector( '#button' ).remove();
                [ ...self.element.querySelectorAll( '.preview' ) ].map( preview => clearPreview( preview ) );

                function clearPreview( element ) {
                  element.remove();
                }

                $.wait( 5000, function () {
                    self.start();
                } );

                if ( self.onfinish ) $.onFinish( self, files_data );

              } );

            }

          }
        } ) );

        if( self.submit === false ) self.element.querySelector( '#box' ).removeChild( self.element.querySelector( '#button' ));

        let input = createInputField();
        draggableForm();


        function draggableForm() {
          let form = self.element.querySelector( '#box' );

          [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event ) {
            form.addEventListener( event, function( e ) {
              e.preventDefault();
            });
          });

          [ 'dragover', 'dragenter' ].forEach( function( event ) {
            form.addEventListener( event, function() {
              form.classList.add( 'is-dragover' );
            });
          });

          [ 'dragleave', 'dragend', 'drop' ].forEach( function( event ) {
            form.addEventListener( event, function() {
              form.classList.remove( 'is-dragover' );
            });
          });

          form.addEventListener( 'drop', function( e ) {
            previewFiles( e.dataTransfer.files );
          });


        }

        function previewFiles( inputFiles ) {

          [].forEach.call( inputFiles ? inputFiles : input.files, readAndPreview );

          function readAndPreview( file ) {
            let preview_template = $.html( self.templates.preview );

            // Make sure `file.name` matches extensions criteria
            if ( /\.(jpe?g|png|gif)$/i.test( file.name ) ) {
              let reader = new FileReader();

              reader.addEventListener( 'load', function () {
                let image = new Image();
                image.title = file.name;
                image.src = this.result;
                filePaths.push( image. src );
                image.height = 120;
                preview_template.querySelector( '.box-image' ).appendChild( image );
                preview_template.querySelector( '.name' ).innerHTML = file.name;
                self.element.querySelector( '#space' ).parentNode.insertBefore( preview_template, self.element.querySelector( '#space' )  );
                self.element.querySelector( '.box-input' ).style.display = 'none';
                files_data.slides.push( { name: file.name, data: this.result, MIME: file.type  } );
              }, false );
              reader.readAsDataURL( file );
            }

          }

        }

        function createInputField() {
          let input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('multiple', 'true');
          input.id = this.index;
          input.style.visibility = 'hidden';
          document.body.appendChild( input );
          input.addEventListener( 'change', function () { previewFiles(); } );
          return input;
        }

        if ( callback ) callback;
      };

      this.getValue  = () => {
        return filePaths;
      }
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );