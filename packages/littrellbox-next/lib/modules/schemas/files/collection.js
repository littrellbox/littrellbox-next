import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

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
      validate: [(validationErrors, document) => {
        let errors = validationErrors;

        if(document.currentUser.lb_filesBlocked === 1) {
          errors.push("0009:NO_PERMISSION")
        }

        return errors
      }]
    }
  }
});

Files.addDefaultView(() => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

export default Files;