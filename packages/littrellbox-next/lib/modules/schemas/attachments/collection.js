import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Attachments = createCollection({
  collectionName: 'Attachments',
  typeName: 'Attachment',
  schema,
  
  resolvers: getDefaultResolvers('Attachments'),
  mutations: getDefaultMutations('Attachments'),

});

//set up some permissions
const membersActions = [
  'attachments.new',
  'attachments.edit.own',
  'attachments.remove.own',
];

Users.groups.members.can(membersActions);

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