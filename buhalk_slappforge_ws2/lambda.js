let AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
let rekog = new AWS.Rekognition();

exports.handler = function (event, context, callback) {
    //console.log(JSON.stringify(event, null, 2));

    let s3 = event.Records[0].s3;
    rekog.detectLabels({
        Image: {
            S3Object: {
                Bucket: s3.bucket.name,
                Name: s3.object.key
            }
        },
        MaxLabels: 1
    }).promise()
        .then(data => {
            console.log(data);
            let label = data.Labels[0].Name;
            ddb.put({
                TableName: 'BuddhikaDB',
                Item: { 'Name': s3.object.key, 'Label': label }
            }).promise()
                .then((data) => {
                    //your logic goes here
                })
                .catch((err) => {
                    //handle error
                });



            callback(null, {});
        })
        .catch(err => callback(err));
}