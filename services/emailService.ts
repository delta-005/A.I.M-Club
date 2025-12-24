
import { ApplicationData, PaymentData } from '../types';

export const sendAdminOTP = async (otp: string, staffName: string, adminEmail: string): Promise<void> => {
    const emailBody = `
PROTOCOL ALERT: DELEGATED ACCESS REQUESTED

A staff member identifying as "${staffName}" is requesting temporary access to the A.I.M. Control Center.

AUTHORIZATION CODE: ${otp}

Provide this code only if you recognize the requester. This code is for one-time use during this session.

Best Regards,
A.I.M. Security System
    `.trim();

    const data = new FormData();
    data.append('name', 'A.I.M. Security');
    data.append('email', adminEmail);
    data.append('_subject', `SECURE ACCESS CODE: ${otp}`);
    data.append('message', emailBody);
    data.append('_captcha', 'false');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error("OTP Uplink Failed.");
    } catch (error) {
        console.error("Transmission error:", error);
        throw error;
    }
};

export const sendInterviewEmail = async (applicant: ApplicationData, adminEmail: string): Promise<void> => {
    if (!applicant.interviewDetails) {
        throw new Error("Interview details are missing.");
    }

    const emailBody = `
Dear ${applicant.name},

Neural Link Established. Your interview for the ${applicant.role} position at the A.I.M. Club has been scheduled.

DATE: ${new Date(applicant.interviewDetails.date).toDateString()}
TIME: ${applicant.interviewDetails.time}
SECURE MEETING LINK: ${applicant.interviewDetails.link}

Please be prepared to discuss your technical interests and vision. We look forward to our synchronisation.

Best Regards,
The A.I.M. Club Committee
    `.trim();

    const data = new FormData();
    data.append('name', applicant.name);
    data.append('email', applicant.email);
    data.append('_cc', applicant.email);
    data.append('_subject', `A.I.M. Club | Interview Scheduled: ${applicant.name}`);
    data.append('message', emailBody);
    data.append('_captcha', 'false');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error("Failed to transmit interview briefing.");
    } catch (error) {
        console.error("Transmission error:", error);
        throw error;
    }
};

export const sendStatusUpdateEmail = async (applicant: ApplicationData, trackingLink: string, adminEmail: string): Promise<void> => {
    const statusMessages: Record<string, string> = {
        'Shortlisted': 'Your profile has passed the initial vetting process. Our committee is now reviewing your responses for final interview scheduling.',
        'Waitlisted': 'You have been placed on our "Shadow Bench". While we cannot offer an intermediate slot, your profile remains active for future openings this cycle.',
        'Selected': 'Synchronisation Complete. Welcome to the A.I.M. Club. We will reach out shortly with onboarding protocols.',
        'Rejected': 'Our selection cycle for this role has concluded. We appreciate your interest and encourage you to apply for future missions.'
    };

    const emailBody = `
Dear ${applicant.name},

Application Status Update: ${applicant.status}

${statusMessages[applicant.status] || 'Your application status has been updated in our database.'}

You can review your full dossier and real-time status at your secure tracking link:
${trackingLink}

Best Regards,
A.I.M. Command Center
    `.trim();

    const data = new FormData();
    data.append('name', applicant.name);
    data.append('email', adminEmail);
    data.append('_replyto', adminEmail);
    data.append('_cc', applicant.email);
    data.append('_subject', `A.I.M. Club | Status Update - ${applicant.status}`);
    data.append('message', emailBody);
    data.append('_captcha', 'false');

    try {
        await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' },
        });
    } catch (error) {
        console.error("Status uplink failed:", error);
    }
};

export const sendApplicationConfirmationEmail = async (applicant: Omit<ApplicationData, 'id' | 'submittedAt'>, trackingLink: string, adminEmail: string): Promise<void> => {
    const emailBody = `
Dear ${applicant.name},

Thank you for registering for the A.I.M. Club! We have successfully received your transmission for the ${applicant.role} position.

VETTING WINDOW:
Your application has been logged into our neural network. The response will be validated within 3-5 working days by our committee.

SUMMARY OF YOUR SUBMISSION:
- Applicant ID: ${applicant.applicantId}
- Role Applied: ${applicant.role}
- Roll Number: ${applicant.rollNumber}
- Year of Study: ${applicant.yearOfStudy} Year

TRACKING PROTOCOL:
You can track your application status in real-time from the link below:
${trackingLink}

We appreciate your interest in joining the A.I.M. ecosystem. You will receive further transmissions as we process your data.

Best Regards,
The A.I.M. Club Committee
    `.trim();

    const data = new FormData();
    data.append('name', applicant.name);
    data.append('email', adminEmail);
    data.append('_replyto', applicant.email);
    data.append('_cc', applicant.email);
    data.append('_subject', `A.I.M. Club | Thank You for Registering - ${applicant.role}`);
    data.append('message', emailBody);
    data.append('_captcha', 'false');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) throw new Error("Email service rejection.");
    } catch (error) {
        console.error("Confirmation error:", error);
        throw error;
    }
};

export const sendPaymentReceiptEmail = async (paymentDetails: PaymentData, adminEmail: string): Promise<void> => {
    const emailBody = `
Dear ${paymentDetails.userName},

Resource Transfer Confirmed. Thank you for your registration for ${paymentDetails.eventName}.

DETAILS:
- Event: ${paymentDetails.eventName}
- Value: ₹${paymentDetails.amount.toFixed(2)}
- Transaction Hash: ${paymentDetails.transactionId}
- Timestamp: ${new Date(paymentDetails.paymentDate).toLocaleString()}

Your spot is secured. We look forward to your participation.

Best Regards,
The A.I.M. Club Committee
    `.trim();

    const data = new FormData();
    data.append('name', paymentDetails.userName);
    data.append('email', paymentDetails.userEmail);
    data.append('_cc', paymentDetails.userEmail);
    data.append('_subject', `A.I.M. Club | Payment Receipt - ${paymentDetails.eventName}`);
    data.append('message', emailBody);
    data.append('_captcha', 'false');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error("Payment receipt uplink failed.");
    } catch (error) {
        console.error("Payment email error:", error);
        throw error;
    }
};
