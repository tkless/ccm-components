/**
 * @overview ccm component for building a comment component
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

( function () {

  var component = {

  name: 'comment_builder',
  version: [ 1,0,0 ],

  ccm: {
    url: 'https://akless.github.io/ccm/version/ccm-12.3.0.min.js',
    integrity: 'sha384-QDTsj+8+DFAUnDU9pBA3NPuJAolurZFVCt3MAZF2a8upsHCKxA9uEKMvIQh6j7Xe',
    crossorigin: 'anonymous'
  },

  config: {
    templates: {
      "main": {
        "class": "container-fluid",
        "inner": [
          {
            "tag": "legend",
            "class": "text-primary",
            "inner": "Build your Comment Component "
          },
          {
            "tag": "form",
            "class": "form-horizontal",
            "onsubmit": "%submit%",
            "inner": [
              {
                "class": "sign-on form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Sign-on:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "user form-control",
                      "name": "user",
                      "inner": [
                        {
                          "tag":"option",
                          "inner": "None",
                          "value": ""
                        },
                        {
                          "tag":"option",
                          "inner": "Guest Mode",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/ccm.user.js',{'sign_on':'guest'}]"
                        },
                        {
                          "tag":"option",
                          "inner": "Demo Mode",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/ccm.user.js',{'sign_on':'demo'}]"
                        },
                        {
                          "tag":"option",
                          "inner": "H-BRS FB02",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/ccm.user.js',{'sign_on':'hbrsinfkaul'}]"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "comment-template form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Used Template:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "user form-control",
                      "name": "comment_template",
                      "inner": [
                        {
                          "tag":"option",
                          "inner": "Simple",
                          "value": "simple"
                        },
                        {
                          "tag":"option",
                          "inner": "Expand",
                          "value": "expand"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "voting form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Used Voting Component:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "user form-control",
                      "name": "voting",
                      "inner": [
                        {
                          "tag":"option",
                          "inner": "None",
                          "value": ""
                        },
                        {
                          "tag":"option",
                          "inner": "Voting",
                          "value": "[ 'ccm.component', '../voting/ccm.voting.js', {'icon_likes': 'fa fa-lg fa-chevron-up', 'icon_dislikes': 'fa fa-lg fa-chevron-down', 'data': {'store': [ 'ccm.store', '../voting/voting_datastore.js' ]}} ]"
                        },
                        {
                          "tag":"option",
                          "inner": "Thumb up/down",
                          "value": "[ 'ccm.component', '../thumb_rating/ccm.thumb_rating.js', { 'key': [ 'ccm.get', '../thumb_rating/thumb_rating_configs.js', 'demo' ] } ]"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "sorting_by_voting form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Sorting comments by voting:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "name": "sorting_by_voting"
                        }
                      }
                    }
                  }

                ]
              },
              {
                "class": "editable form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Editable:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "name": "editable"
                        }
                      }
                    }
                  }

                ]
              },
              {
                "class": "submit-button form-group",
                "inner": [

                  {
                    "class": "col-md-12 text-right",
                    "inner": {
                      "tag": "button",
                      "type": "submit",
                      "class": "btn btn-primary",
                      "inner": "Save App"
                    }
                  }
                ]

              }
            ]
          }
        ]
      }
    },

    css: [ 'ccm.load',
      { context: 'head', url: 'https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css' },
      'https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css'
    ]
    //preview: [ 'ccm.component', '../comment/ccm.comment.js' ]
  },

    Instance: function () {
      var self = this;

      this.submit = function () {
        if ( self.onfinish ) self.ccm.helper.onFinish( self, getResultData() );
      };

      this.start = function (callback) {
        self.ccm.helper.setContent( self.element, self.ccm.helper.html( self.templates.main, {
          submit: self.submit,
          change: function () {
            self.onchange && self.onchange( self, getResultData() );
          }
        } ));

        if( !self.submit_button ) {
          self.element.querySelector( '.form-horizontal' ).removeChild( self.element.querySelector( '.submit-button' ) );
        }

        if ( callback ) callback();
      };

      function getResultData() {
        var config_data = self.ccm.helper.formData( self.element.querySelector( 'form' ) );

        self.ccm.helper.decodeDependencies( config_data );
        return config_data;
      }
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );