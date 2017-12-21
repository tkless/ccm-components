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
              {
                "class": "box-buttons col-md-12",
                "inner": [
                  {
                    "tag": "button",
                    "class": "btn btn-info box-button",
                    "onclick": "%submit%",
                    "inner": "Upload"
                  },
                  {
                    "tag": "button",
                    "class": "btn btn-primary box-button",
                    "onclick": "%restart%",
                    "inner": "Clear"
                  }
                ]
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
              "class": "box-progress"
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
              "class": "box-success-mark",
              "inner": "<svg width='54px' height='54px' viewBox='0 0 54 54' version='1.1' xmlns='http://www.w3.org/2000/svg\' xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'>\n" +
              "<title>Check</title>\n<defs></defs>\n<g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n" +
              "<path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n </g>\n</svg>\n"
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

                self.element.querySelector( '.box-success-mark' ).classList.add( 'visible' );
                self.element.querySelector( '.box-progress' ).classList.add( 'visible' );

                if ( self.onfinish ) $.onFinish( self, files_data );

              } );
            }
          },
          restart: event => {
            event.preventDefault();
            event.stopPropagation();

            self.start();
          }
        } ) );

        if( self.submit === false ) self.element.querySelector( '#box' ).removeChild( self.element.querySelector( '.box-buttons' ));

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
            self.element.querySelector( '.box-buttons' ).classList.add( 'visible' );
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
                self.element.querySelector( '.box-buttons' ).parentNode.insertBefore( preview_template, self.element.querySelector( '.box-buttons' )  );
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