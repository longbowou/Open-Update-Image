# Open Update Image Lambda

This Lambda function provides a seamless image upload experience, handling both the secure storage of images in Amazon
S3 and updating user profile information in DynamoDB. It’s designed to allow users to easily upload their profile
pictures, delivering modern and interactive functionality for any application. Here’s a breakdown of the key aspects.

![Screenshot 2024-10-23 at 1.33.48 PM.png](screenshots/apigateway/Screenshot%202024-10-23%20at%201.33.48%E2%80%AFPM.png)

## Key Highlights

- **Real-Time Image Uploads with S3**:
  When a user uploads a profile picture, the function generates a signed URL that allows the client to upload the image
  directly to the specified S3 bucket. The signed URL is temporary and secure, expiring after 60 seconds, ensuring that
  uploads happen quickly and safely.

- **Automatic Profile Updates in DynamoDB**:
  Once the image is uploaded to S3, the Lambda function instantly updates the user’s profile in DynamoDB, linking the
  uploaded image to their account. This real-time profile management keeps user data current and accessible.

- **Serverless Architecture**:
  This function leverages the full power of AWS Lambda, dynamically scaling to handle any volume of upload requests
  without requiring any server management. The function triggers on user requests, providing an efficient and scalable
  solution for media handling.

## How It Works

**S3 Integration**: The function interacts with Amazon S3 to store uploaded profile images. By using the
PutObjectCommand, it ensures each file is stored with the correct content type, while also providing a pre-signed URL
for secure, temporary access to upload the image.

**DynamoDB as a Central User Database**: After the image is uploaded, the function immediately updates the user’s
imageUrl field in DynamoDB, ensuring that the latest image is associated with the correct user account.

**User-Friendly Error Handling**: The function comes equipped with validation to ensure all necessary fields (like
fileName and contentType) are provided. If any information is missing or if an error occurs, clear and informative
responses are sent back to the client, improving the overall user experience.

## Why This Lambda is Awesome

This Lambda function delivers the perfect blend of security, scalability, and speed. It empowers applications to handle
image uploads and profile updates efficiently, all while leveraging AWS’s robust infrastructure. The result? A
cost-effective, serverless, and reliable solution that enhances user experience by enabling quick and easy profile
personalization.

### What's next ?

Check the [main](https://github.com/longbowou/open-frontend) repository this one is part of.

## Screenshot

![Screenshot 2024-10-22 at 9.49.03 PM.png](screenshots/lambda/Screenshot%202024-10-22%20at%209.49.03%E2%80%AFPM.png)

## License

This project is licensed under the [MIT License](LICENSE).







