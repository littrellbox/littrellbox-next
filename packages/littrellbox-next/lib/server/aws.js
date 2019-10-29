import { WebApp } from 'meteor/webapp';
import { getSetting } from 'meteor/vulcan:core';

import aws4 from 'aws4';

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const region = getSetting('digitalocean.region');
const accessKey = getSetting('digitalocean.accessKey');
const secret = getSetting('digitalocean.accessKeySecret');
const bucket = getSetting('digitalocean.bucket');
const host = `${region}.digitaloceanspaces.com`;

const spacesEndpoint = new AWS.Endpoint(host);
AWS.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: accessKey,
  secretAccessKey: secret
});

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
        response.end(data.Location)
      } catch (error) {
        response.statusCode = 503;
        response.end(error.toString())
      }
    });
  } else {
    next();
  }
});