import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <p>Welcome to CribDirect! These Terms of Service ("Terms") govern your access to and use of the CribDirect website, mobile applications, and services (collectively, the "Service"). Please read these Terms carefully before using the Service.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Service Description</h2>
          <p>CribDirect provides a platform to connect individuals seeking to rent residential properties ("Tenants") directly with verified property owners ("Landlords"). We facilitate communication but are not a party to any rental agreement between Tenants and Landlords.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. User Accounts</h2>
          <p>You may need to register for an account to access certain features. You agree to provide accurate, current, and complete information during registration and keep your account information updated. You are responsible for safeguarding your password and for all activities that occur under your account.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">4. Landlord Verification</h2>
          <p>Landlords must submit required property ownership documents for verification before listing properties. CribDirect reserves the right to approve or reject landlord applications based on our verification process. We do not guarantee the authenticity of documents beyond our reasonable verification efforts.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">5. User Conduct</h2>
          <p>You agree not to use the Service for any unlawful purpose or in any way that could harm CribDirect, its users, or third parties. Prohibited activities include posting false information, harassment, spamming, and attempting unauthorized access.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">6. Disclaimers</h2>
          <p>The Service is provided "as is" without warranties of any kind. CribDirect does not guarantee the accuracy of listings, the condition of properties, or the conduct of users. Renters are advised to conduct their own due diligence, including property inspections.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">7. Limitation of Liability</h2>
          <p>CribDirect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">8. Modifications to Terms</h2>
          <p>We may modify these Terms at any time. We will notify you of significant changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">9. Governing Law</h2>
          <p>These Terms shall be governed by the laws of [Your Jurisdiction, e.g., the Federal Republic of Nigeria], without regard to its conflict of law provisions.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at [Your Contact Email/Info].</p>

          <p className="italic pt-6">Please replace placeholder text like "[Your Jurisdiction]" and "[Your Contact Email/Info]" with your actual details. This is a basic template and should be reviewed by a legal professional to ensure it meets your specific needs and local regulations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
