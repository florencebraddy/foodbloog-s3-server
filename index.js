require("dotenv").config();
const aws = require("aws-sdk");

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

async function getS3Data() {
  const s3response = await s3
    .listObjectsV2({
      Bucket: "recipestorage83411-dev",
      Prefix: ""
    })
    .promise();

  console.log(s3response);
}
getS3Data();
