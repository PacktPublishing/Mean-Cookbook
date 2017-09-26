import * as mongoose from 'mongoose';
import * as mocks from './mocks';
import * as bluebird from 'bluebird';

import { ConnectionBase } from "mongoose";

var env = process.env.NODE_ENV || 'development';
global.Promise = bluebird;
(<any>mongoose).Promise = bluebird;

mongoose.connect('mongodb://localhost/mean-db').then(function() {
  if (env == 'development') {
    mongoose.connection.db.dropDatabase().then(function() {
      mocks.generateAuthorAndPosts(3);
      mocks.generateAuthorAndPosts(3);
      mocks.generateAuthorAndPosts(3);
      mocks.generateAdmin()
    });
  }
}, function(error) {
  console.error('failed to connect to MongoDB...', error);
});

debugger;

export const mongooseConnection:ConnectionBase = mongoose.connection;