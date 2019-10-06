import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';

const Planets = createCollection({
  collectionName: 'Planets',
  typeName: 'Planet',
  schema,
  
  resolvers: getDefaultResolvers('Planets'),
  mutations: getDefaultMutations('Planets'),

});

//set up some permissions
const membersActions = [
  'planets.new',
  'planets.edit.own',
  'planets.remove.own',
];

Users.groups.members.can(membersActions);

Planets.addDefaultView(terms => ({
  options: {
    sort: {
      //put the newest at the bottom
      createdAt: 1 
    }
  }
}));

export default Planets;