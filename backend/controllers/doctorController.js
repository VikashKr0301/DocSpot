import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { sendDoctorPasswordResetEmail } from '../config/emailService.js';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";


// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await doctorModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to request password reset for doctor
const requestDoctorPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        doctor.resetPasswordToken = resetToken;
        doctor.resetPasswordExpires = resetTokenExpires;
        await doctor.save();
        // Send reset email
        await sendDoctorPasswordResetEmail(email, resetToken, doctor.name);

        res.json({
            success: true,
            message: "Password reset email sent! Please check your inbox."
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to reset doctor password
const resetDoctorPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        const doctor = await doctorModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!doctor) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        doctor.password = hashedPassword;
        doctor.resetPasswordToken = undefined;
        doctor.resetPasswordExpires = undefined;
        await doctor.save();

        res.json({
            success: true,
            message: "Password reset successful! You can now login with your new password."
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        }

        res.json({ success: false, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        }

        res.json({ success: false, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availablity Changed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({ success: true, profileData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

        res.json({ success: true, message: 'Profile Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body;

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        })

        let patients = [];

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginDoctor, requestDoctorPasswordReset, resetDoctorPassword, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile }