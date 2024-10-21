import {DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const region = 'us-east-2'

const DYNAMO_TABLE_NAME = 'ProjectOpen';
const S3_BUCKET_NAME = 'project-open-media';

const dynamoDbClient = new DynamoDBClient({region});
const s3Client = new S3Client({region});

export const handler = async (event) => {
    try {
        let user = event.requestContext.authorizer;

        const {
            fileName,
            contentType
        } = JSON.parse(event.body);

        if (!fileName || !contentType) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({message: 'All fields are required'}),
            };
        }

        const uploadParams = {
            Bucket: S3_BUCKET_NAME,
            Key: fileName,
            ContentType: contentType,
        };
        const command = new PutObjectCommand(uploadParams);
        const uploadURL = await getSignedUrl(s3Client, command, {expiresIn: 60});
        const imageUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

        const updateParams = {
            TableName: DYNAMO_TABLE_NAME,
            Key: {
                id: {S: user.id}
            },
            UpdateExpression: 'SET #n = :imageUrl',
            ExpressionAttributeNames: {
                '#n': 'imageUrl'
            },
            ExpressionAttributeValues: {
                ':imageUrl': {S: imageUrl},
            },
            ReturnValues: 'ALL_NEW'
        };

        const data = await dynamoDbClient.send(new UpdateItemCommand(updateParams));
        console.log(data)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                errors: [],
                imageUrl,
                uploadURL
            }),
        };
    } catch (err) {
        console.error('Error updating user image:', err);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Failed to update user image'
            }),
        };
    }
};
