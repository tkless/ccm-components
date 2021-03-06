ccm.files[ "configs.js" ] = {
  "demo": {
    editable: true,
    sorting_by_voting: true,
    comment_template: 'expanded',
    data: { store: [ 'ccm.store', { 'store': 'comment', 'url': 'https://ccm.inf.h-brs.de' } ], key: 'demo' },
    user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js', { sign_on: 'demo' } ],
    voting: [ 'ccm.component', 'https://tkless.github.io/ccm-components/thumb_rating/versions/ccm.thumb_rating-1.0.0.min.js', {
      buttons: true,
      data: { store: [ 'ccm.store', 'https://tkless.github.io/ccm-components/voting/resources/datastore.js' ] },
      user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.js' ]
    } ]
  },

  "local": {
    editable: true,
    sorting_by_voting: true,
    data: { store: [ 'ccm.store', '../comment/resources/datastore.js' ], key: 'demo' },
    user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.js' ], //{ logged_in: true, 'guest.user': 'tmeskh2s' } ],
    voting: [ 'ccm.component', '../thumb_rating/ccm.thumb_rating.js', {
      buttons: true,
      data: { store: [ 'ccm.store', '../voting/resources/datastore.js' ] },
      user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.js' ]
    } ]
  },

  "localhost": {
    editable: true,
    sorting_by_voting: true,
    data: { store: [ 'ccm.store', { 'store': 'comment', 'url': 'http://localhost:8080' } ], key: 'demo' },
    user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js', { "sign_on": "demo" } ],
    voting: [ 'ccm.component', 'https://tkless.github.io/ccm-components/voting/versions/ccm.voting-1.0.0.js', {
      icon_likes: 'fa fa-lg fa-chevron-up',
      icon_dislikes: 'fa fa-lg fa-chevron-down',
      data: { store: [ 'ccm.store', { 'store': 'voting', 'url': 'ws://localhost:8080' } ] },
      user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js' ]
    } ]
  },

  "lea": {
    "comment_template": "expanded",
    "data": {
      "store": [ "ccm.store", { "store": "slidecast_comments", "url": "https://ccm.inf.h-brs.de" } ],
      "key": "learning_apps"
    },
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "sign_on": "demo" } ],
    "voting": [ "ccm.component", "https://tkless.github.io/ccm-components/thumb_rating/versions/ccm.thumb_rating-1.0.0.min.js",
      {
        "buttons": "true",
        "data": { "store": [ "ccm.store", { "store": "voting", "url": "wss://ccm.inf.h-brs.de" } ] },
        "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "sign_on": "demo" } ]
      }
    ]
  }
};