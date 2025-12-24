import { account, storage, databases, appwriteConfig } from '../config/appwrite';
import { ID } from 'appwrite';

class AppwriteService {
    // Admin Authentication
    async createAdminAccount({ email, password, name }) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.loginAdmin({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async loginAdmin({ email, password }) {
        try {
            return await account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentAdmin() {
        try {
            return await account.get();
        } catch (error) {
            throw error;
        }
    }

    async logoutAdmin() {
        try {
            return await account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    // Check if user is admin
    async isAdmin() {
        try {
            const user = await this.getCurrentAdmin();
            const adminEmails = ['admin@gramacharitra.com', 'admin@gmail.com'];
            return adminEmails.includes(user.email);
        } catch (error) {
            return false;
        }
    }

    // Village CRUD Operations in Appwrite
    async createVillage({ name, district, state, imageFile, description = "" }) {
        try {
            let imageId = null;
            let imageUrl = null;

            // Upload image if provided
            if (imageFile) {
                const uploadedFile = await this.uploadFile(imageFile);
                imageId = uploadedFile.$id;
                imageUrl = this.getFilePreview(imageId);
            }

            // Create village document
            const villageData = {
                name,
                district,
                state,
                description,
                imageId,
                imageUrl: imageUrl?.toString() || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId, // Using post collection for villages
                ID.unique(),
                villageData
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    async getAllVillages() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId
            );
            return response.documents;
        } catch (error) {
            throw error;
        }
    }

    async getVillageById(villageId) {
        try {
            const response = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                villageId
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateVillage(villageId, { name, district, state, imageFile, description }) {
        try {
            let updateData = {
                name,
                district,
                state,
                description,
                updatedAt: new Date().toISOString()
            };

            // Handle image update if new file provided
            if (imageFile) {
                // Get current village to delete old image
                const currentVillage = await this.getVillageById(villageId);
                if (currentVillage.imageId) {
                    await this.deleteFile(currentVillage.imageId);
                }

                // Upload new image
                const uploadedFile = await this.uploadFile(imageFile);
                updateData.imageId = uploadedFile.$id;
                updateData.imageUrl = this.getFilePreview(uploadedFile.$id).toString();
            }

            const response = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                villageId,
                updateData
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteVillage(villageId) {
        try {
            // Get village to delete associated image
            const village = await this.getVillageById(villageId);
            if (village.imageId) {
                await this.deleteFile(village.imageId);
            }

            await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                villageId
            );

            return true;
        } catch (error) {
            throw error;
        }
    }

    // File Upload for Village Images
    async uploadFile(file) {
        try {
            return await storage.createFile(
                appwriteConfig.storageId,
                ID.unique(),
                file
            );
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(fileId) {
        return storage.getFilePreview(
            appwriteConfig.storageId,
            fileId
        );
    }

    async deleteFile(fileId) {
        try {
            await storage.deleteFile(
                appwriteConfig.storageId,
                fileId
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

const appwriteService = new AppwriteService();
export default appwriteService;