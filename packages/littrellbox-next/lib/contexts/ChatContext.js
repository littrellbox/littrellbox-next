import React from 'react'

export const ChatContext = React.createContext({
  planet: {},
  channel: {},
  switchPlanet: (planetToSet) => {},
  switchChannel: (channelToSet) => {},
  onDrop: (acceptedFiles) => {},
  removeFile: (key) => {},
  removeAllFiles: () => {},
  clearPlanet: () => {},
  attachments: []
});