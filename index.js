require("dotenv").config();
const aws = require("aws-sdk");
const asyncMap = require("./helpers");
const express = require("express");
const cors = require("cors");
const PORT = 3000;

const app = express(PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_ACCESS_KEY);

function setCredentials() {
  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2"
  });
}
setCredentials();

const s3 = new aws.S3();
const bucket = "recipestorage83411-dev";

app.get("/photos", (request, response) => {
  async function getS3Data() {
    const s3response = await s3
      .listObjectsV2({
        Bucket: bucket,
        Prefix: ""
      })
      .promise();

    const filesToRetriveArray = s3response.Contents;

    try {
      const resolvedFiles = await asyncMap(
        filesToRetriveArray.map(file =>
          s3
            .getObject({
              Bucket: bucket,
              Key: file.Key
            })
            .promise()
        )
      );
      console.log(resolvedFiles);
      response.status(200).send(resolvedFiles);
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  }
  getS3Data();
});

function authorizeUser() {
  console.log("Authorized");
}

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
