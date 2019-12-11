import { WebApp } from 'meteor/webapp';
import { getSetting } from 'meteor/vulcan:core';

const request = require('request');

const AWS = require('aws-sdk');
const fs = require('fs');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

let bucket = "lbn-default-bucket";

let host = "";

if(Meteor.isProduction) {
  const region = getSetting('digitalocean.region');
  const accessKey = getSetting('digitalocean.accessKey');
  const secret = getSetting('digitalocean.accessKeySecret');
  let host = `${region}.digitaloceanspaces.com`;
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
  host = getSetting('developmentBucket.endpoint');
  const spacesEndpoint = new AWS.Endpoint(host);
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

const uploadFile = (buffer, fields, type) => {
  const params = { 
    ACL: 'public-read',
    Body: buffer,
    Bucket: bucket,
    ContentType: type,
    Key: `${fields.folder[0]}/${fields.name[0]}`
  };
  return s3.upload(params).promise();
};

const checkIsBrowserRenderable = function(filetype) {
  return filetype === "image/jpeg" || filetype === "image/gif" || filetype === "image/png" || filetype === "image/x-icon";
};

WebApp.connectHandlers.use((request, response, next) => {
  if (request.url === '/api/aws-upload-endpoint') {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        if(files.file[0].size > 8*1024*1024) {
          response.statusCode = 400;
          response.end("file_too_big");
          return
        }
        const buffer = fs.readFileSync(path);
        const data = await uploadFile(buffer, fields, files.file[0].headers['content-type']);
        response.statusCode = 200;
        response.end(data.Location)
      } catch (error) {
        response.statusCode = 500;
        console.log(error);
        response.end(error.toString())
      }
    });
  } else {
    next();
  }
});

WebApp.connectHandlers.use((request, response, next) => {
  if (request.url === '/api/aws-upload-endpoint-pfp') {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        if(files.file[0].size > 8*1024*1024) {
          response.statusCode = 400;
          response.end("file_too_big");
          return
        } 

        if(!checkIsBrowserRenderable(files.file[0].headers['content-type'])) {
          response.statusCode = 400;
          response.end("invalid_file_type");
          return
        }
        const buffer = fs.readFileSync(path);
        const data = await uploadFile(buffer, fields);
        response.statusCode = 200;
        response.end(data.Location)
      } catch (error) {
        response.statusCode = 500;
        console.log(error);
        response.end(error.toString())
      }
    });
  } else {
    next();
  }
});

WebApp.connectHandlers.use((request, response, next) => {
    if (request.url === '/api/aws-upload-endpoint-planetpic') {
        const form = new multiparty.Form();
        form.parse(request, async (error, fields, files) => {
            if (error) throw new Error(error);
            try {
                const path = files.file[0].path;
                if(files.file[0].size > 8*1024*1024) {
                    response.statusCode = 400;
                    response.end("file_too_big");
                    return
                } 

                if(!checkIsBrowserRenderable(files.file[0].headers['content-type'])) {
                    response.statusCode = 400;
                    response.end("invalid_file_type");
                    return
                }
                const buffer = fs.readFileSync(path);
                const data = await uploadFile(buffer, fields);
                response.statusCode = 200;
                response.end(data.Location)
            } catch (error) {
                response.statusCode = 500;
                console.log(error);
                response.end(error.toString())
            }
        });
    } else {
        next();
    }
});

WebApp.connectHandlers.use((req, res, next) => {
  if (req.url.startsWith("/download/")) {
    if(!req.cookies.meteor_login_token) {
      //extremely lazy login check, it really isn't that important if they aren't logged in
      res.statusCode = 403;
      res.end("403 Unauthorized")
    }
    let url = req.url.substr(10);
    let fileNameList = req.url.split("/");
    let fileName = fileNameList[fileNameList.length - 1];
    res.setHeader('Content-Disposition', 'attachment; filename="' +fileName + '"');
    if(Meteor.isProduction) {
      request("https://" + bucket + "." + host + "/" + url).pipe(res)
    } else {
      request(host + "/" + bucket + "/" + url).pipe(res)
    }
  } else {
    next();
  }
});
