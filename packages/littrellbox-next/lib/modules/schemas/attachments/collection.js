import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
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
      validate: [(validationErrors, document, properties) => { 
        errors = validationErrors

        if(!document.data.postId) {
          errors.push("missing_message_id")
        }

        if(!document.data.type) {
          errors.push("missing_type")
        }

        if(!document.data.attachmentId) {
          errors.push("missing_attachment_id")
        }

        post = Messages.findOne(document.data.postId)

        if(post.userId != document.currentUser._id) {
          errors.push("no_permission")
        }

        if(document.currentUser.lb_filesAllowed && document.data.type == "file") {
          errors.push("no_permission")
        }

        console.log(errors)

        return errors;
       }]
    }
  }
});

Attachments.addDefaultView(terms => ({
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