/**
 * @overview ccm component for feedback
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

{
  var component = {

    name: 'feedback',
    version:[ 1,0,0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-11.5.0.min.js',
      integrity: 'sha384-7lrORUPPd2raLsrPJYo0Arz8csPcGzgyNbKOr9Rx3k0ECU0T8BP+B1ejo8+wmUzh',
      crossorigin: 'anonymous'
    },

    config: {
      "templates": {
        "feedback": {
          "id": "slideout",
          "inner": [
            {
              "tag": "img",
              "src": "https://tkless.github.io/ccm-components/feedback/resources/feedback.png",
              "alt": "feedback"
            },
            {
              "id": "slideout-inner",
              "inner":[
                {
                  "class": "row panel panel-success",
                  "inner": {
                    "tag": "form",
                    "onsubmit": "%submit%",
                    "inner": [
                      {
                        "class": "panel-body",
                        "inner": [
                          {
                            "class": "form-group",
                            "inner": [
                              {
                                "tag": "label",
                                "for": "Title",
                                "inner": "Title"
                              },
                              {
                                "tag": "input",
                                "type": "text",
                                "required": true,
                                "class": "form-control",
                                "id": "Title"
                              },
                            ]
                          },
                          {
                            "class": "form-group",
                            "inner": {
                              "tag": "textarea",
                              "required": true,
                              "rows": "5",
                              "class": "form-control",
                              "placeholder": "Write here..."
                            }
                          },
                          {
                            "class": "form-group",
                            "inner": {
                              "tag": "button",
                              "class": "btn btn-info btn-sm pull-right",
                              "typ": "submit",
                              "inner": "Submit"
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      },

      //onfinish: { log: true },
      data: { store: [ "ccm.store", {} ] },
      css: [ 'ccm.load',
        { context: 'head', url: 'https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css' },
        'https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css'
      ],
      lib: [ 'ccm.load', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js' ]
    },

    Instance: function () {
      let $;

      this.init = callback => {
        if ( this.position === 'left')
          ccm.load( { context: this.element.parentNode, url: 'https://tkless.github.io/ccm-components/feedback/resources/left.css' } );
        else
          ccm.load( { context: this.element.parentNode, url: 'https://tkless.github.io/ccm-components/feedback/resources/right.css' } );
        callback();
      };

      this.ready = callback => {
        $ = this.ccm.helper;
        callback();
      };

      this.start = callback => {

        $.dataset( this.data, dataset => {

          if ( this.logger ) self.logger.log( 'start', dataset );

          if ( !dataset.feedbacks ) dataset.feedbacks =[];

          $.setContent( this.element, this.ccm.helper.html( this.templates.feedback, {
            submit: event => {

              if ( event ) event.preventDefault();

              let data = {
                "date":  moment().format(),
                "title": this.element.querySelector( 'input[type=text]' ).value,
                "content": this.element.querySelector( 'textarea' ).value
              };

              dataset.feedbacks.push( data );
              // update dataset
              this.data.store.set( dataset, () => {

                if ( this.logger ) {
                  data = $.clone( data );
                  delete dataset.user;
                  this.logger.log( 'create', data );
                }

                // visual effect, that the feedback was saved successfully
                if ( this.element.querySelector( '.saved' ) ) $.removeElement( this.element.querySelector( '.saved' ) );
                this.element.querySelector( '.panel-body' ).appendChild( $.html( {
                  "tag": "strong",
                  "class": "text-success saved",
                  "inner": "Saved <span class='glyphicon glyphicon-saved'></span>"
                } ) );
                this.element.querySelector( 'form' ).reset();


                if ( this.onfinish ) $.onFinish( this, data );

              } );
            }
          } ));

          // change feedback position from above
          if ( this.from_above ) {
            this.element.querySelector( '#slideout' ).style.top = this.from_above;
            this.element.querySelector( '#slideout-inner' ).style.top = this.from_above;
          }

          if ( callback ) callback();
        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}