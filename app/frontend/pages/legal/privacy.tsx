import PublicLayout from "@/layouts/public-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Privacy() {
  return (
    <PublicLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            
            <CardContent className="space-y-6 prose prose-sm max-w-none">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                
                <h3 className="text-lg font-medium mb-2">Account Information</h3>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Name and display name</li>
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Account creation and login timestamps</li>
                </ul>

                <h3 className="text-lg font-medium mb-2">Content Data</h3>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Document titles and content you create</li>
                  <li>Publishing and editing timestamps</li>
                  <li>Document metadata (word count, reading time)</li>
                </ul>

                <h3 className="text-lg font-medium mb-2">Keystroke Verification Data</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Keystroke timing and patterns</li>
                  <li>Key codes and characters typed</li>
                  <li>Cursor position and document interaction data</li>
                  <li>This data is used solely for authenticity verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain the Signify service</li>
                  <li>Verify the authenticity of human-written content</li>
                  <li>Enable publishing and sharing of verified content</li>
                  <li>Communicate with you about your account</li>
                  <li>Improve our service and user experience</li>
                  <li>Ensure security and prevent abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="mb-3">We do not sell your personal information. We may share information in these limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Public Content:</strong> Published documents and their verification data are publicly accessible</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Service Providers:</strong> With trusted partners who help us operate the service</li>
                  <li><strong>Your Consent:</strong> When you explicitly authorize us to share information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <p className="mb-3">We implement security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encrypted password storage using industry-standard hashing</li>
                  <li>Secure session management</li>
                  <li>Rate limiting to prevent abuse</li>
                  <li>Input validation and sanitization</li>
                  <li>Regular security updates and monitoring</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights and Choices</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> You can view all your data through your account</li>
                  <li><strong>Export:</strong> Download your documents and keystroke data anytime</li>
                  <li><strong>Correction:</strong> Update your account information and content</li>
                  <li><strong>Deletion:</strong> Delete individual documents or your entire account</li>
                  <li><strong>Portability:</strong> Export your data in standard formats (JSON, CSV)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Keystroke Data Details</h2>
                <p className="mb-3">Our keystroke verification system:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Records timing patterns, not actual keystrokes content</li>
                  <li>Does not capture passwords or data from other applications</li>
                  <li>Only operates within Signify documents</li>
                  <li>Provides mathematical proof of human authorship</li>
                  <li>Can be exported or deleted by you at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account data is retained while your account is active</li>
                  <li>Published content remains public unless you unpublish it</li>
                  <li>Deleted accounts are purged within 30 days</li>
                  <li>Backup copies may persist for up to 90 days for recovery purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
                <p className="mb-3">We use minimal tracking:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Session cookies for authentication (required)</li>
                  <li>No third-party tracking or advertising cookies</li>
                  <li>No analytics tracking by default</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify users of any 
                  material changes by posting the new policy on this page with an updated &ldquo;Last updated&rdquo; date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy or our data practices, 
                  please contact us through our support page.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </PublicLayout>
  )
}
