ccm.files[ 'configs.js' ] = {
  'demo': {
    data: { store: [ 'ccm.store', { store: 'question', 'url': 'https://ccm.inf.h-brs.de' } ], key: "demo" },
    user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js', { logged_in: true, sign_on: 'demo' } ],
    voting: [  "ccm.component", "https://tkless.github.io/ccm-components/voting/versions/ccm.voting-1.0.0.js", {
      data: { store: [ 'ccm.store', { store: 'voting', 'url': 'https://ccm.inf.h-brs.de' } ] },
      user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.js' ]
    } ]
  },

  'local': {
    data: { store: [ 'ccm.store', '../question/resources/datastore.js' ], key: "demo" },
    user:  [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.js', { logged_in: true } ],
    voting: [ 'ccm.component', '../voting/ccm.voting.js', {
      data: { store: [ 'ccm.store', '../voting/resources/datastore.js' ] },
      user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.js' ]
      } ]
  }
};