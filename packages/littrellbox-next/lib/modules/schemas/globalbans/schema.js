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
  bannedUserId: {
    type: String,
    optional: true,
    canRead: ['guests']
  }
};

export default schema;