import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Files = createCollection({
  collectionName: 'Files',
  typeName: 'File',
  schema,
  
  resolvers: getDefaultResolvers('Files'),
  mutations: getDefaultMutations('Files'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['owners', 'admins', 'moderators'],
    canDelete: ['owners', 'admins', 'moderators'],
  },

  callbacks: {
    create: {
      validate: [(validationErrors, document, properties) => { 
        errors = validationErrors
        if(document.currentUser.lb_filesAllowed) {
          errors.push("no_permission")
        }
      }]
    }
  }
});

Files.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

export default Files;