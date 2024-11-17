import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY!,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  region: process.env.REACT_APP_AWS_REGION!,
});

const s3 = new AWS.S3();

interface Feedback {
  imageUrl?: string;
  content?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const listFeedbackObjects = async (): Promise<{ [key: string]: Partial<Feedback> }> => {
  const params = {
    Bucket: 'feedback-storage-bucket',
  };

  const data = await s3.listObjectsV2(params).promise();
  const feedbackMap: { [key: string]: Partial<Feedback> } = {};

  data.Contents?.forEach((item) => {
    if (item.Key) {
      const baseName = item.Key.split('.')[0]; // Extract the unique identifier
      const fileType = item.Key.split('.').pop(); // Extract file extension

      if (!feedbackMap[baseName]) {
        feedbackMap[baseName] = {};
      }

      if (fileType === 'txt') {
        feedbackMap[baseName].content = `https://${params.Bucket}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${item.Key}`;
      } else {
        feedbackMap[baseName].imageUrl = `https://${params.Bucket}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${item.Key}`;
      }
    }
  });

  return feedbackMap;
};

export const getFeedbackContent = async (contentUrl: string): Promise<Feedback> => {
  const contentResponse = await fetch(contentUrl);
  const contentJson = await contentResponse.json();
  return contentJson as Feedback; // Parse JSON to extract feedback and location
};

export const uploadFeedback = async (
  feedbackId: string,
  feedback: string,
  file: File,
  location: { lat: number; lng: number }
): Promise<void> => {
  // Upload feedback text as a separate file
  const feedbackParams = {
    Bucket: 'feedback-storage-bucket',
    Key: `${feedbackId}.txt`,
    Body: JSON.stringify({ feedback, location }),
    ContentType: 'application/json',
  };
  await s3.upload(feedbackParams).promise();

  // Upload the image file
  const fileExtension = file.name.split('.').splice(-1, 1)[0];
  const fileParams = {
    Bucket: 'feedback-storage-bucket',
    Key: `${feedbackId}.${fileExtension}`,
    Body: file,
    ContentType: file.type,
  };
  await s3.upload(fileParams).promise();
};
