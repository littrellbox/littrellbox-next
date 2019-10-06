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
      resolver: (movie, args, context) => {
        return context.Users.findOne(
          { _id: movie.userId },
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
    resolveAs: {
      fieldName: 'planet',
      type: 'Planet',
      resolver: (message, args, context) => {
        return context.Planets.findOne(
          { _id: message.planetId },
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

  channelId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
    resolveAs: {
      fieldName: 'channel',
      type: 'Channel',
      resolver: (message, args, context) => {
        return context.Channels.findOne(
          { _id: message.channelId },
          {
            fields: context.Channels.getViewableFields(
              context.Channels
            ),
          }
        );
      },
      addOriginalField: true,
    }
  },

  //content
  text: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  },

  //TODO: add file support
  fileId: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  }
};