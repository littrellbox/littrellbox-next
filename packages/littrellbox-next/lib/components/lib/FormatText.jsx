import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent, withSingle } from 'meteor/vulcan:core';

export const formatText = (message) => {
  processed = message.replace("\\n", "\n")
  return processed;
}