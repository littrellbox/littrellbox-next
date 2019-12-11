import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';

import schema from './schema.js';

import Messages from '../messages/collection'

const Attachments = createCollection({
  collectionName: 'Attachments',
  typeName: 'Attachment',
  schema,
  
  resolvers: getDefaultResolvers('Attachments'),
  mutations: getDefaultMutations('Attachments'),

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

        if(!document.data.postId) {
          errors.push("0013:MISSING_POST_ID")
        }

        if(!document.data.type) {
          errors.push("0014:MISSING_TYPE")
        }

        if(!document.data.attachmentId) {
          errors.push("0015:MISSING_ATTACHMENT_ID")
        }

        let post = Messages.findOne(document.data.postId);

        if(post.userId !== document.currentUser._id) {
          errors.push("0016:NO_PERMISSION")
        }

        if(document.currentUser.lb_filesAllowed && document.data.type === "file") {
          errors.push("0017:FILES_BLOCKED")
        }
        
        return errors;
       }]
    }
  }
});

Attachments.addDefaultView(() => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

Attachments.addView('byPostId', terms => ({
  selector: {
    postId: terms.postId
  }
}));

export default Attachments;