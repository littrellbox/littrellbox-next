Package.describe({
  name: 'littrellbox-next',
});

Package.onUse(function (api) {

  api.use([
    
    // Here are our dependencies:
    // SASS/SCSS support
    'fourseven:scss@4.5.0',
    
    // vulcan core
    'promise',
    'vulcan:core@1.14.0',

    // vulcan packages
    'vulcan:forms@1.14.0',
    'vulcan:accounts@1.14.0',
    'vulcan:ui-bootstrap@1.14.0',
    'vulcan:admin@1.14.0',
    'vulcan:debug@1.14.0',
    'vulcan:users@1.14.0'

  ]);

  api.addFiles('lib/stylesheets/style.scss');
  
  // Here is the entry point for client & server:
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
