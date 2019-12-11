// modules/routes.js #tutorial-step-6 - 
// This is the file that is called into package.js that allows the component to be found. 

// First, we import this from vulcan core, which is a utility to add a new route.
import { addRoute } from 'meteor/vulcan:core';

// Then, we add the component for what we want to add.
import '../components/Main.jsx';
import '../components/invites/InviteMain'

// Next, we add the name 'movies', the path, which is the root, and the component name 'MovieList'. 
addRoute({ name: 'main', path: '/', componentName: 'Main' });
addRoute({ name: 'invite', path: '/invite/*', componentName:'InviteMain'});