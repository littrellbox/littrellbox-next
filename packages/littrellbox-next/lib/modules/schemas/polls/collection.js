import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

import schema from './schema.js';

const Polls = createCollection({
  collectionName: 'Polls',
  typeName: 'Poll',
  schema,
  
  resolvers: getDefaultResolvers('Polls'),
  mutations: getDefaultMutations('Polls'),

  permissions: {
    canCreate: ['members'],
    canRead: ['members'],
    canUpdate: ['members'],
    canDelete: ['owners', 'admins', 'moderators'],
  },

  callbacks: {
    update: {
      validate: [(validationErrors, document) => {
        let errors = validationErrors;

        console.log(document);

        return errors
      }]
    }
  }
});

Polls.addDefaultView(() => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

export default Polls;