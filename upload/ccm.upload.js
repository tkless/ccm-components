{

  var component = {

    name: 'upload',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      templates: {
        "upload": {
          "inner": {
            "class": "container",
            "inner":
              {
                "class": "row",
                "inner":[
                  {
                    "tag": "form",
                    "id": "upload_widget",
                    "method": "post",
                    "action": "%server_url%",
                    "class": "dropzone"
                  },
                  {
                    "class": "input-group",
                    "inner": [
                      {
                        "tag": "span",
                        "class": "input-group-addon",
                        "inner": {
                          "tag": "span",
                          "class": "glyphicon glyphicon-folder-open"
                        }
                      },
                      {
                        "tag": "input",
                        "class": "form-control",
                        "name": "folder",
                        "type": "text",
                        "aria-label": "Enter folder name",
                        "placeholder": "upload folder name ...",
                        "required": "true"
                      },

                      {
                        "tag": "span",
                        "class": "input-group-btn",
                        "inner": {
                          "tag": "button",
                          "type": "button",
                          "class": "start btn btn-primary disabled",
                          "inner": "upload"
                        }
                      }

                    ]
                  }
                ]
              }
          }
        }
      },
      uploadBoxMassage: "<span class='glyphicon glyphicon-cloud-upload col-md-12'></span>",
      url: "http://localhost:8080/upload",
      libs: [ 'ccm.load',
        { context: 'head', url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' },
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
        '../upload/resources/dropzone/dropzone.js',
        '../upload/resources/default.css'
      ]
    },

    Instance: function () {

      this.ready = callback => {
        $ = this.ccm.helper;
        callback();
      };

      this.start = callback => {
        $.setContent( this.element, $.html( this.templates.upload, {
          server_url: this.url
        } ) );

        Dropzone.autoDiscover = false;

        let myDrop = new Dropzone( this.element.querySelector('#upload_widget'), {
          headers: {
            "Cache-Control": "",
            "X-Requested-With": ""
          },
          paramName: 'file',
          maxFileSize: 4, // MB
          parallelUploads: 100,
          uploadMultiple: true,
          autoProcessQueue: false,
          dictDefaultMessage: this.uploadBoxMassage,
          dictResponseError: 'Upload faild',
          acceptedFiles: 'image/*',
        });

        let folder = this.element.querySelector( 'input[name="folder"]' );
        myDrop.on( 'sending', ( file, xhr, formData ) => {
          formData.append( "folder", folder.value );
        });

        myDrop.on( 'success', ( file, resp ) => {
          console.log( file );
          console.log( resp );
          myDrop.removeFile(file);
        });

        myDrop.on( 'addedfile', () => {
          this.element.querySelector( '.start' ).classList.remove( 'disabled' );
        });

        myDrop.on( 'error', () => {
          this.element.querySelector( '.dz-progress' ).style.background = 'red';
        });

        this.element.querySelector( '.start' ).addEventListener( 'click', () => {
          myDrop.processQueue();
        });


        if ( callback ) callback();
      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
};