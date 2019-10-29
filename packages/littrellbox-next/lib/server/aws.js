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
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type, fields) => {
  console.log(fields)
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: bucket,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

WebApp.connectHandlers.use((request, response, next) => {
  if (request.url === '/api/aws-upload-endpoint') {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      console.log(fields)
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        const fileName = `bucketFolder/${timestamp}-lg`;
        const data = await uploadFile(buffer, fileName, type, fields);
        return response.status(200).send(data);
      } catch (error) {
        return response.status(400).send(error);
      }
    });
  } else {
    next();
  }
});