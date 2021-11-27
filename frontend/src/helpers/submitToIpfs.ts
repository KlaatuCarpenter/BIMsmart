import AWS from "aws-sdk";
  
  
  interface Parameters {
    Bucket: string;
    Key: string;
    Body: File;
  }

export const submitToIpfs = (file: File, fileName: string) => {
    const config = {
        apiVersion: "2006-03-01",
        region: process.env.REACT_APP_REGION_NAME,
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        endpoint: "https://storageapi.fleek.co",
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        s3ForcePathStyle: true,
      };

      const s3 = new AWS.S3(config);
    
      const params: Parameters = {
        Bucket: process.env.REACT_APP_PROJECT_BUCKET!,
        Body: file!,
        Key: fileName,
      };

      return s3.putObject(params);
    
}