import React from 'react'

export const ChatContext = React.createContext({
  planet: {},
  channel: {},
  planetMember: {},
  switchPlanet: (planetToSet) => {return planetToSet},
  switchChannel: (channelToSet) => {return channelToSet},
  setPlanetMember: (memberToSet) => {return memberToSet},
  onDrop: (acceptedFiles) => {return acceptedFiles},
  removeFile: (key) => {return key},
  removeAllFiles: () => {return null},
  clearPlanet: () => {return null},
  attachments: []
});