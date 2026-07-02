const AdoptionApplication = require('./adoption_application_model');
const nodemailer = require('nodemailer');

// Create new adoption application
exports.createApplication = async (req, res) => {
    console.log("Inside createApplication");
    try {
        const applicationData = req.body;
        console.log("Received application data:", applicationData);
        // Simple server-side validation
        if (!applicationData.agreement) {
            return res.status(400).json({ message: "You must agree to terms." });
        }

        const newApplication = new AdoptionApplication(applicationData);
        await newApplication.save();

        res.status(201).json({ message: "Application submitted successfully", data: newApplication });
    } catch (error) {
        console.error("Error creating adoption application:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all adoption applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await AdoptionApplication.find().sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching adoption applications:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get single application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const application = await AdoptionApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        console.error("Error fetching adoption application:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const application = await AdoptionApplication.findOneAndUpdate(
            { applicationID: req.params.adoptionApplicationID },
            { status },
            { new: true }
        );
        const { email_address, full_name, animalID } = application;
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Create mail transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'ashikoshi123@gmail.com', // use a dedicated account
            pass: 'npej zjqr uuhi mfgo', // App password from Google (not your normal password)
            },
        });

        const mailOptions = {
            from: '"Smart Animal Shelter" <ashikoshi123@gmail.com>',
            to: email_address,
            subject: '🎉 Adoption Application Approved!',
            html: `
            <div style="font-family:sans-serif; color:#333;">
                <h2>Hi ${full_name},</h2>
                <p>We’re excited to inform you that your adoption application for animal ID <strong>${animalID}</strong> has been <b style="color:green;">approved!</b> 🎉</p>
                <p>Our team will contact you shortly with next steps.</p>
                <br>
                <p>Thank you for choosing to adopt and give a pet a loving home 💛</p>
                <p>– Smart Animal Shelter Team</p>
            </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Approval email sent successfully" });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ error: "Failed to send email" });
        }
        

        res.status(200).json({ message: "Application status updated", data: application });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await AdoptionApplication.findOne({ applicationID: req.params.adoptionApplicationID });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        await application.remove();
        res.status(200).json({ message: "Application deleted successfully", data: application });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
