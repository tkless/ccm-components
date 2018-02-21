ccm.files[ "configs.js" ] = {
  "localhost": {
    button: true,
    data: { store: [ 'ccm.store', { 'store': 'file_upload', 'url': 'http://localhost:8080', 'method': 'POST' } ] },
    user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js', { "sign_on": "demo" } ],
    onfinish:  function( results ){ console.log(results) }
  },

  "demo": {
    button: true,
    data: { store: [ 'ccm.store', { 'store': 'file_upload', 'url': 'https://ccm.inf.h-brs.de', 'method': 'POST' } ] },
    user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js', { "sign_on": "demo" } ],
    onfinish:  function( results ){ console.log(results) }
  }
};