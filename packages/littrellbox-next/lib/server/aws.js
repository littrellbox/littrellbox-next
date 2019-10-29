import { WebApp } from 'meteor/webapp';
import { getSetting } from 'meteor/vulcan:core';

import aws4 from 'aws4';

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

var bucket = "lbn-default-bucket"

if(Meteor.isProduction) {
  const region = getSetting('digitalocean.region');
  const accessKey = getSetting('digitalocean.accessKey');
  const secret = getSetting('digitalocean.accessKeySecret');
  const host = `${region}.digitaloceanspaces.com`;
  const spacesEndpoint = new AWS.Endpoint(host);
  AWS.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: accessKey,
    secretAccessKey: secret
  });
  bucket = getSetting('digitalocean.bucket')
} else {
  const accessKey = getSetting('developmentBucket.accessKey');
  const secret = getSetting('developmentBucket.accessKeySecret');
  const spacesEndpoint = new AWS.Endpoint(getSetting('developmentBucket.endpoint'));
  AWS.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: accessKey,
    secretAccessKey: secret,
    s3ForcePathStyle: true
  });
  bucket = getSetting('developmentBucket.bucket')
}

AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

const uploadFile = (buffer, fields) => {
  const params = { 
    ACL: 'public-read',
    Body: buffer,
    Bucket: bucket,
    ContentType: fields.fileType[0],
    Key: `${fields.folder[0]}/${fields.name[0]}`
  };
  return s3.upload(params).promise();
};

WebApp.connectHandlers.use((request, response, next) => {
  if (request.url === '/api/aws-upload-endpoint') {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const data = await uploadFile(buffer, fields);
        response.statusCode = 200;
        console.log(data)
        response.end(data.Location)
      } catch (error) {
        response.statusCode = 503;
        console.log(error)
        response.end(error.toString())
      }
    });
  } else {
    next();
  }
});