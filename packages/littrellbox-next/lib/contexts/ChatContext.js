import React from 'react'

export const ChatContext = React.createContext({
  planet: {},
  channel: {},
  planetMember: {},
  switchPlanet: (planetToSet) => {},
  switchChannel: (channelToSet) => {},
  setPlanetMember: (memberToSet) => {},
  onDrop: (acceptedFiles) => {},
  removeFile: (key) => {},
  removeAllFiles: () => {},
  clearPlanet: () => {},
  attachments: []
});