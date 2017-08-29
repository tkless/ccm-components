/**
 * @overview ccm component for quill editor
 * @author Tea Kless <tea.kless@web.de>, 2017
 * @license The MIT License (MIT)
 */

( function () {


  var component  = {

    name: 'editor',
    version:[ 1,0,0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-10.0.0.min.js',
      integrity: 'sha384-bCcBv9yCHVcXtsHxkfPcFeT+j77G112ZADZ1DkxcYdxjflPG4lTiiFiB3Jp+c2NG',
      crossorigin: 'anonymous'
    },

    config: {
      editor: [ 'ccm.load', '//cdn.quilljs.com/1.2.0/quill.min.js' ],
      editor_css: [ 'ccm.load', '//cdn.quilljs.com/1.2.0/quill.snow.css' ],
      settings: {
        modules: {
          toolbar: [
            [ { header: [ 1, 2, false ] } ],
            [ 'bold', 'italic', 'underline' ],
            [ 'image', 'code-block' ]
          ]
        },
        placeholder: 'Write here...',
        theme: 'snow'
      }
    },

    Instance: function () {
      var editor;

      this.start = function ( callback ) {
        var div = this.ccm.helper.html( {} );
        this.element.innerHTML = '';
        this.element.appendChild( div );
        editor = new Quill( div, this.settings );
        if ( callback ) callback( this );
      };
      this.get = function () { return editor; }
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );