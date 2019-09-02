/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://fr.reactjs.org';
const version = '16.8.6';
=======
const urlRoot = 'https://reactjs.org';
const version = '16.9.0';
>>>>>>> 941f54180ef5e652221f54ef6d1f6f2e9e063597
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
