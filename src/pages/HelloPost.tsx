import React from "react";

export default function HelloPost() {
  return (
    <div className="bg-white min-h-[calc(100vh-110px)] p-2 py-4 lg:p-4 pb-0 lg:pb-0">
    <div className="px-4 pt-1 space-y-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-lg">
          Effective Date: July 1, 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <p className="text-foreground leading-relaxed mb-8">
          Desieasy ("we", "our", "us") respects your privacy.
        </p>

        <p className="text-foreground leading-relaxed mb-8">
          This Privacy Policy explains how we collect, use, and protect your
          information when you use our platform and services available at
          desieasy.com (the "Site" or "Platform").
        </p>

        <p className="text-foreground leading-relaxed mb-12">
          By accessing or using Desieasy, you agree to the collection and use
          of your information in accordance with this policy.
        </p>

        {/* Section 1 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                A. Account Information
              </h3>
              <ul className="space-y-2 text-foreground ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Name
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Email address (used for authentication)
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  OAuth login (Google, if chosen)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                B. Listing and Communication Information
              </h3>
              <ul className="space-y-2 text-foreground ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Listings you create (including description, images, and
                  location details)
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Messages you send or receive through our platform chat
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                C. Location Data
              </h3>
              <ul className="space-y-2 text-foreground ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  City selected manually while posting or browsing
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  IP address
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                D. Device and Usage Information
              </h3>
              <ul className="space-y-2 text-foreground ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Browser type and version
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  IP address
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Device identifiers
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Activity on our platform (such as pages viewed and searches
                  performed)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                E. Cookies & Analytics
              </h3>
              <ul className="space-y-2 text-foreground ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We use cookies and similar technologies to improve your
                  experience.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We also use Google Analytics to understand how our site is
                  used.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-4">
            We use your information to:
          </p>

          <ul className="space-y-2 text-foreground ml-4 mb-6">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Provide, operate, and maintain the Desieasy platform
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Enable listing creation and management
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Facilitate user communication through chat
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Detect and prevent fraud or abuse
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Improve and personalize your experience
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Respond to your inquiries and support requests
            </li>
          </ul>

          <p className="text-foreground leading-relaxed font-medium">
            We do not sell your personal information to third parties.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              3. Sharing of Information
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-6">
            We do not sell or share your personal information with third
            parties, except:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Service Providers:
              </h3>
              <p className="text-foreground leading-relaxed ml-4">
                Third-party services we use to operate Desieasy, such as
                Google (OAuth login & Analytics) and AWS (cloud hosting &
                storage).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Legal Obligations:
              </h3>
              <p className="text-foreground leading-relaxed ml-4">
                If required by law, regulation, or legal process, we may
                disclose your information and to enforce our Terms of Service
                or protect our rights.
              </p>
            </div>
          </div>

          <p className="text-foreground leading-relaxed font-medium mt-6">
            We do not share your information with marketers, advertisers, or
            unrelated third parties.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              4. User-Generated Content
            </h2>
          </div>

          <ul className="space-y-4 text-foreground ml-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Any listings or messages you submit are visible to others as
              intended by the platform functionality.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You are responsible for ensuring that your listings and
              communications do not include sensitive personal data or
              infringe on third-party rights (including copyright or privacy
              rights).
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              5. Cookies and Tracking Technologies
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>

          <ul className="space-y-2 text-foreground ml-4 mb-6">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Remember user preferences
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Improve platform performance
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Analyze usage patterns
            </li>
          </ul>

          <p className="text-foreground leading-relaxed">
            You can control cookies through your browser settings.
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              6. Data Retention
            </h2>
          </div>

          <ul className="space-y-4 text-foreground ml-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We retain your information as long as your account is active or
              as needed to provide services.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We make good faith efforts to store data securely, but can make
              no guarantees.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You may request deletion of your account and associated data by
              emailing us at support@desieasy.com.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Some information may remain in backups or archives for legal and
              operational reasons.
            </li>
          </ul>
        </div>

        {/* Section 7 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              7. California Users
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-4">
            If you are a California resident, you have certain privacy rights
            under the California Consumer Privacy Act (CCPA) and the
            California Privacy Rights Act (CPRA). These include:
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Right to Know:
              </h3>
              <p className="text-foreground leading-relaxed ml-4">
                You may request details about the categories and specific
                pieces of personal information we have collected about you.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Right to Delete:
              </h3>
              <p className="text-foreground leading-relaxed ml-4">
                You may request that we delete the personal information we
                hold about you, subject to certain exceptions (such as legal
                obligations or security purposes).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Right to Non-Discrimination:
              </h3>
              <p className="text-foreground leading-relaxed ml-4">
                We will not discriminate against you for exercising your
                privacy rights.
              </p>
            </div>
          </div>

          <p className="text-foreground leading-relaxed mb-4">
            To exercise any of these rights, you may contact us at
            support@desieasy.com with the subject line "California Privacy
            Request".
          </p>

          <p className="text-foreground leading-relaxed mb-4">
            Only you, or someone you authorize to act on your behalf, may make
            a request to know or delete your data. An authorized agent may
            make a request on your behalf by providing written permission
            signed by you.
          </p>

          <p className="text-foreground leading-relaxed">
            We will need to confirm your identity before processing your
            request by asking you to log into your existing account (if you
            are a registered user) or by asking you for additional
            information, such as a government-issued ID, to confirm your
            identity against information we have already collected.
          </p>
        </div>

        {/* Section 8 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              8. Security
            </h2>
          </div>

          <ul className="space-y-4 text-foreground ml-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We take reasonable measures to protect your personal
              information, but no platform can guarantee absolute security.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You are responsible for maintaining the security of your login
              credentials.
            </li>
          </ul>
        </div>

        {/* Section 9 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              9. Age Restrictions
            </h2>
          </div>

          <ul className="space-y-4 text-foreground ml-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Desieasy is intended for individuals aged 18 years and above
              only.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We do not knowingly collect data from children under 18.
            </li>
          </ul>
        </div>

        {/* Section 10 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              10. Third-Party Links
            </h2>
          </div>

          <p className="text-foreground leading-relaxed">
            Desieasy may contain links to third-party websites, including
            external links in user-submitted content or sponsored ads. These
            links are provided for convenience or promotional purposes only.
            We do not endorse or control the content, products, or services
            offered by third-party sites and are not responsible for their
            privacy practices or terms. Please review their privacy policies
            before engaging with them.
          </p>
        </div>

        {/* Section 11 */}
        <div className="mb-10">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              11. Changes to This Privacy Policy
            </h2>
          </div>

          <ul className="space-y-4 text-foreground ml-4">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              We may update this Privacy Policy from time to time. Changes
              will be posted on this page with the updated effective date.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              If changes are significant, we may notify you through the
              platform or by email.
            </li>
          </ul>
        </div>

        {/* Section 12 - Contact */}
        <div className="mb-8">
          <div className="border-b border-border pb-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              12. Contact Us
            </h2>
          </div>

          <p className="text-foreground leading-relaxed mb-6">
            For any questions or concerns about this Privacy Policy, please
            contact us at:
          </p>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <a
              href="mailto:support@desieasy.com"
              className="text-primary font-semibold hover:underline text-lg"
            >
              support@desieasy.com
            </a>
          </div>
        </div>
      </div>
      
    </div>

    {/* Footer */}
    <AboutFooter />
  </div>
  );
}
