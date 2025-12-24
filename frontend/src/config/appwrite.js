import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.REACT_APP_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '67d52a00e3bdc3ab419f');
 
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const appwriteConfig = {
    databaseId: process.env.REACT_APP_APPWRITE_DATABASE_ID || '67bdb3030029d0328f74',
    storageId: process.env.REACT_APP_APPWRITE_STORAGE_ID || '67bdb24a001a6d0937f1',
    userCollectionId: process.env.REACT_APP_APPWRITE_USER_COLLECTION_ID || '67bdb3a6001cf48aa674',
    postCollectionId: process.env.REACT_APP_APPWRITE_POST_COLLECTION_ID || '67bdb335000f95139a04',
    savesCollectionId: process.env.REACT_APP_APPWRITE_SAVES_COLLECTION_ID || '67bdb3c100034611051d',
    followersCollectionId: process.env.REACT_APP_APPWRITE_FOLLOWERS_COLLECTION_ID || '67d53cdc00230f9da251'
};

export default client;