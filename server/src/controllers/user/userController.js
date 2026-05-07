const userRepo = require('../../repositories/user.repo');

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const profile = await userRepo.getUserProfile(parseInt(userId));

        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPublicUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const profile = await userRepo.getPublicUserProfile(parseInt(userId));
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error in getPublicUserProfile:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phone, address, bio } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Verify user ownership
        if (req.user.userId !== parseInt(userId)) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const profileData = {
            name: name || '',
            phone: phone || '',
            address: address || '',
            bio: bio || ''
        };

        const updatedProfile = await userRepo.updateUserProfile(parseInt(userId), profileData);

        if (!updatedProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const courses = await userRepo.getEnrolledCourses(parseInt(userId));

        res.status(200).json(courses);
    } catch (error) {
        console.error('Error in getEnrolledCourses:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserInvoices = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const invoices = await userRepo.getUserInvoices(parseInt(userId));

        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error in getUserInvoices:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getInvoiceDetails = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        if (!invoiceId) {
            return res.status(400).json({ message: "Invoice ID is required" });
        }

        const items = await userRepo.getInvoiceItems(parseInt(invoiceId));

        res.status(200).json(items);
    } catch (error) {
        console.error('Error in getInvoiceDetails:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getUserProfile,
    getPublicUserProfile,
    updateUserProfile,
    getEnrolledCourses,
    getUserInvoices,
    getInvoiceDetails
};
