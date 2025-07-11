import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
    fs.readFileSync('./firebase-key.json', 'utf-8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'mcp-server-da337.appspot.com'
});

const bucket = admin.storage().bucket();

export default bucket;
