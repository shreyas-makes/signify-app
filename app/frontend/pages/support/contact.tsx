import { Bug, HelpCircle, Mail, MessageCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Signify</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Contact & Support</h1>
            <p className="text-muted-foreground">
              Get help with Signify or report issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">General Support</p>
                      <p className="text-sm text-muted-foreground">
                        Questions about using Signify
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Bug className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Bug Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Found something broken? Let us know
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Feature Requests</p>
                      <p className="text-sm text-muted-foreground">
                        Ideas to make Signify better
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Response Time</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">1-2 business days</Badge>
                    <Badge variant="outline">Usually faster</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <p className="text-sm text-muted-foreground">
                  We&rsquo;ll get back to you as soon as possible
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of your message"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      placeholder="Please provide as much detail as possible..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button className="w-full" disabled>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message (Coming Soon)
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Contact form will be available after email setup
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">How does keystroke verification work?</h3>
                <p className="text-sm text-muted-foreground">
                  Signify captures the timing and patterns of your keystrokes as you write, creating a unique 
                  fingerprint that proves the content was written by a human, not AI.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Is my keystroke data private?</h3>
                <p className="text-sm text-muted-foreground">
                  Your keystroke timing data is used only for verification. For published posts, verification 
                  data is made publicly available to prove authenticity. You can export or delete your data anytime.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Can I export my data?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can download all your documents and keystroke data in JSON or CSV format from any document page.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">What happens if I delete my account?</h3>
                <p className="text-sm text-muted-foreground">
                  All your documents and keystroke data will be permanently deleted within 30 days. 
                  Published posts will be removed from public view.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status and Info */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Service Status</span>
                <Badge variant="default" className="bg-green-600">
                  All Systems Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Version</span>
                <Badge variant="outline">MVP 1.0</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Centers</span>
                <Badge variant="secondary">Hetzner EU</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
