const schema = {
  //default properties
  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },

  createdAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    onCreate: () => {
      return new Date();
    },
  },

  userId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (channel, args, context) => {
        return context.Users.findOne(
          { _id: channel.userId },
          {
            fields: context.Users.getViewableFields(
              context.currentUser,
              context.Users
            ),
          }
        );
      },
      addOriginalField: true,
    },
  },
  
  //identifiers
  planetId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
    searchable: true,
    resolveAs: {
      fieldName: 'planet',
      type: 'Planet',
      resolver: (channel, args, context) => {
        return context.Planets.findOne(
          { _id: channel.planetId },
          {
            fields: context.Planets.getViewableFields(
              context.Planets
            ),
          }
        );
      },
      addOriginalField: true,
    }
  },

  //content
  name: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  },
  
  isDm: {
    type: Boolean,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  },

  dmUserIds: {
    type: [String],
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  }
};

export default schema;