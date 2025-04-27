import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
           <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

           <p>CribDirect ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and services (collectively, the "Service").</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
           <p>We may collect information that identifies you personally ("Personal Information") such as:</p>
           <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, phone number, password when you register.</li>
                <li><strong>Landlord Information:</strong> In addition to account information, property ownership documents submitted for verification.</li>
                <li><strong>Listing Information:</strong> Property details, images, rental terms provided by Landlords.</li>
                <li><strong>Communication Data:</strong> Messages exchanged between users through the Service.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with the Service (e.g., IP address, browser type, pages visited, search queries).</li>
           </ul>

           <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
           <p>We use the information we collect to:</p>
           <ul className="list-disc pl-6 space-y-1">
                <li>Provide, operate, and maintain the Service.</li>
                <li>Verify Landlord accounts and property ownership.</li>
                <li>Facilitate communication between Tenants and Landlords.</li>
                <li>Improve and personalize the Service.</li>
                <li>Respond to your comments, questions, and requests.</li>
                <li>Monitor and analyze usage and trends.</li>
                <li>Prevent fraudulent activity and ensure security.</li>
                <li>Comply with legal obligations.</li>
           </ul>

           <h2 className="text-xl font-semibold text-foreground pt-4">3. How We Share Your Information</h2>
           <p>We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Between Users:</strong> Basic profile information (like name) and communication data are shared between Tenants and Landlords when they interact. Contact details like phone numbers may be shared based on user settings or explicit actions (e.g., a call button).</li>
                <li><strong>With Service Providers:</strong> We may share information with third-party vendors who perform services for us (e.g., hosting, data analysis, verification services), under confidentiality agreements.</li>
                <li><strong>For Legal Reasons:</strong> If required by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale of company assets, or acquisition.</li>
            </ul>
            <p>We do not sell your Personal Information to third parties.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">4. Data Security</h2>
           <p>We implement reasonable security measures (including encryption for sensitive documents) to protect your information. However, no electronic transmission or storage is 100% secure.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">5. Data Retention</h2>
           <p>We retain your Personal Information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">6. Your Choices</h2>
           <p>You may review, update, or delete your account information through your account settings. You can opt-out of certain communications. Note that deleting your account may not immediately remove all data from our backup systems.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">7. Children's Privacy</h2>
           <p>The Service is not intended for individuals under the age of 18. We do not knowingly collect Personal Information from children under 18.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">8. Changes to This Policy</h2>
           <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>

            <h2 className="text-xl font-semibold text-foreground pt-4">9. Contact Us</h2>
           <p>If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Info].</p>

           <p className="italic pt-6">This is a basic template. Consult with a legal professional to tailor it to your specific data practices and comply with relevant privacy laws (like NDPR in Nigeria).</p>
        </CardContent>
      </Card>
    </div>
  );
}
