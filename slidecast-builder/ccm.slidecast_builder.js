/**
 * @overview ccm component for building a slidecast component
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'slidecast_builder',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://akless.github.io/ccm/ccm.js',

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "id": "main",
        "class": "container-fluid",
        "inner": [
          {
            "tag": "legend",
            "class": "text-primary",
            "inner": "Build your Slidecast"
          },
          {
            "tag": "form",
            "class": "form",
            "onsubmit": "%submit%",
            "inner": [

              {
                "class": "navigation text-center",
                "inner": [
                  {
                    "class": "btn-group",
                    "inner":[
                      {
                        "tag": "a",
                        "typ": "button",
                        "class": "active btn btn-basic btn-info info",
                        "onclick": "%basic%",
                        "inner": "Basic"
                      },
                      {
                        "tag": "a",
                        "typ": "button",
                        "class": "btn btn-adv btn-warning info",
                        "onclick": "%advanced%",
                        "inner": "Advanced"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "basic",
                "class": "show",
                "inner": [
                  {
                    "class": "drop form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "drop",
                        "class": "control-label",
                        "inner": [
                          "Upload slides ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner":
                              {
                                "tag": "p",
                                "inner": "Drop or choose files to upload."
                              }
                          }
                        ]
                      },
                      {
                        "id": "upload"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "advanced",
                "class": "hide",
                "inner": [
                  {
                    "class": "css form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "css",
                        "class": "control-label",
                        "inner": [
                          "Layout ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Choose between different layouts, in which the slidecast text is displayed."
                          }
                        ]
                      },
                      {
                        "tag": "select",
                        "onchange": "%change%",
                        "class": "form-control",
                        "id": "css",
                        "name": "css",
                        "inner": [
                          {
                            "tag": "option",
                            "inner": "Default",
                            "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/default.css']"
                          },
                          {
                            "tag": "option",
                            "inner": "LEA-like",
                            "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css','https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',{'context': 'head','url':'https://fonts.googleapis.com/css?family=Montserrat:200'}]"
                          },
                          {
                            "tag": "option",
                            "inner": "PBWorks-like",
                            "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/pbworks.css','https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',{'context': 'head','url':'https://fonts.googleapis.com/css?family=Montserrat:200'}]"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "class": "user form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "user",
                        "class": "control-label",
                        "inner": [
                          "Sign-on ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign warning"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": [
                              "If you select a sign-on mode here, authentication will be requested after the completion of the fill-in-the-blank text and the results will only be submitted if the authentication was successful. The various sign-on modes are described below.",
                              {
                                "tag": "h5",
                                "inner": "Guest Mode"
                              },
                              {
                                "tag": "p",
                                "inner": "Every user will automatically logged in as the user \"guest\". This mode is mostly used for test scenarios."
                              },
                              {
                                "tag": "h5",
                                "inner": "Demo Mode"
                              },
                              {
                                "tag": "p",
                                "inner": "The user can authenticate with any username and without password. This mode is mostly used for demo scenarios."
                              },
                              {
                                "tag": "h5",
                                "inner": "H-BRS FB02"
                              },
                              {
                                "tag": "p",
                                "inner": "In this mode the user has to authenticate access with a valid account from the Department of Computer Sciences at Hochschule Bonn-Rhein-Sieg University of Applied Sciences."
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "tag": "select",
                        "onchange": "%change%",
                        "class": "form-control",
                        "id": "user",
                        "name": "user",
                        "inner": [
                          {
                            "tag": "option",
                            "inner": "None",
                            "value": ""
                          },
                          {
                            "tag": "option",
                            "inner": "Guest Mode",
                            "value": "['ccm.instance','https://akless.github.io/ccm-components/user/ccm.user.js',{'sign_on':'guest'}]"
                          },
                          {
                            "tag": "option",
                            "inner": "Demo Mode",
                            "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo'}]"
                          },
                          {
                            "tag": "option",
                            "inner": "H-BRS FB02",
                            "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'hbrsinfkaul'}]"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "class": "preview",
                "inner": [
                  {
                    "tag": "legend",
                    "class": "legend text-primary",
                    "inner": "Here's a Preview of what you've Build"
                  },
                  {
                    "id": "preview"
                  }
                ]
              },
              {
                "class": "submit submit-button form-group",
                "inner": [
                  {
                    "class": "col-md-12 text-right",
                    "inner": {
                      "tag": "input",
                      "type": "submit",
                      "id": "submit",
                      "class": "btn btn-primary"
                    }
                  }
                ]

              }

            ]
          }
        ]
      },
      "css": [ "ccm.load", "https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css",
        { "context": "head", "url": "https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css" },
        "../slidecast-builder/resources/default.css"
      ],
      "target": [ "ccm.component", "../slidecast/ccm.slidecast.js" ],
      "submit_button": true,
      "preview": true,
      "file_upload": [ "ccm.component", "../file_upload/ccm.file_upload.js" ],

  /*
      "start_values": {
        "css": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css']",
        "user": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo'}]",
        "onchange": { console.log(self) }
      }
  */
  //  onchange
  //  onfinish

    },

    Instance: function () {
      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {
        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render input elements
        $.setContent( self.element, $.html( my.html, {
          basic: function () {
            console.log("!!!");
            // set active button
            self.element.querySelector( '.btn-adv' ).classList.remove( 'active' );
            self.element.querySelector( '.btn-basic' ).classList.add( 'active' );

            self.element.querySelector( '#advanced' ).classList.remove( 'show' );
            self.element.querySelector( '#basic' ).classList.remove( 'hide' );
            self.element.querySelector( '#advanced' ).classList.add( 'hide' );
            self.element.querySelector( '#basic' ).classList.add( 'show' );
          },
          advanced: function () {
            console.log("!!!");
            self.element.querySelector( '.btn-basic' ).classList.remove( 'active' );
            self.element.querySelector( '.btn-adv' ).classList.add( 'active' );

            self.element.querySelector( '#advanced' ).classList.remove( 'hide' );
            self.element.querySelector( '#basic' ).classList.remove( 'show' );
            self.element.querySelector( '#advanced' ).classList.add( 'show' );
            self.element.querySelector( '#basic' ).classList.add( 'hide' );
          },
          help: function () {
            // hide and show help texts
            const this_a = this;
            $.makeIterable( self.element.querySelectorAll( 'a' ) ).map( other_a => other_a !== this_a && other_a.classList.remove( 'active' ) );
            this.classList.toggle( 'active' );

          }
        } ) );

        my.file_upload.start( instance => {
          self.element.querySelector( '#upload' ).appendChild( instance.root );
        } );

        if( callback ) callback();

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}