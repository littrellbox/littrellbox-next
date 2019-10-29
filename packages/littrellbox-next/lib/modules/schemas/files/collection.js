import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Files = createCollection({
  collectionName: 'Files',
  typeName: 'File',
  schema,
  
  resolvers: getDefaultResolvers('Files'),
  mutations: getDefaultMutations('Files'),

});

//set up some permissions
const membersActions = [
  'files.new',
  'files.edit.own',
  'files.remove.own',
];

Users.groups.members.can(membersActions);

Files.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

Files.addView('byPlanetId', terms => ({
  selector: {
    planetId: terms.planetId
  }
}));

export default Files;