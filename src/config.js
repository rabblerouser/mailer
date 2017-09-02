module.exports = {
  sesRegion: 'us-east-1',
  sesEndpoint: process.env.SES_ENDPOINT,
  kinesisRegion: process.env.KINESIS_REGION || 'ap-southeast-2',
  kinesisEndpoint: process.env.KINESIS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'FAKE',
  streamName: process.env.STREAM_NAME,
  listenerAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',
  s3EmailBucket: process.env.S3_EMAIL_BUCKET || 'bucket',
  s3EmailBucketEndpoint: process.env.S3_EMAIL_BUCKET_ENDPOINT || 'bucketEndpoint',
  s3Region: process.env.S3_REGION || 'ap-southeast-2',
};
