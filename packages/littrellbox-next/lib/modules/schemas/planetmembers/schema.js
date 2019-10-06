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
      resolver: (planetmember, args, context) => {
        return context.Users.findOne(
          { _id: planetmember.userId },
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
  
  //content
  planetId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
    resolveAs: {
      fieldName: 'planet',
      type: 'Planet',
      resolver: (planetmember, args, context) => {
        return context.Planets.findOne(
          { _id: planetmember.planetId },
          {
            fields: context.Planets.getViewableFields(
              context.Planets
            ),
          }
        );
      },
      addOriginalField: true,
    }
  }
};