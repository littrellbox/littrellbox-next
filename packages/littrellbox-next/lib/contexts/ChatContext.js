import React from 'react'

export const ChatContext = React.createContext({
  planet: {},
  channel: {},
  switchPlanet: (planetToSet) => {},
  switchChannel: (channelToSet) => {}
});