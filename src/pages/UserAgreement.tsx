import { Mail } from "lucide-react";

const UserAgreement = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-110px)] p-2 py-4 lg:p-4">
      <div className="px-4 pt-1 space-y-6 bg-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            User Agreement
          </h1>
          <p className="text-muted-foreground text-lg">
            Effective Date: July 1, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-foreground leading-relaxed mb-8">
            Welcome to Desieasy ("we," "us," or "our"). This User Agreement
            ("Terms") governs your access to and use of our website, services,
            and any related content (collectively, the "Platform"). By using
            Desieasy, you agree to these Terms in full. If you do not agree,
            please do not use the Platform.
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                1. Use of Platform
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Desieasy is a location-based listings platform where users can
              browse and post various types of listings. By using the platform,
              you confirm that you are at least 18 years old and are using the
              platform lawfully and responsibly.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                2. Accounts & Access
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Users may browse listings on Desieasy without creating an account.
              However, to post listings or use the messaging feature, users must
              sign in using a valid email address or through Google OAuth. Users
              are responsible for maintaining the confidentiality and security
              of their login credentials, for all activity that occurs under
              their account, and Desieasy reserves the right to suspend or
              remove accounts that violate this agreement or misuse the
              platform.
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                3. Listings
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Users can create and publish listings directly on the platform.
              Listings must follow our content guidelines, which prohibit hate
              speech, scams, adult content, and illegal goods or services. Some
              listings may be subject to manual review based on their category
              or location before going live. Users may edit or delete their
              listings at any time through their account. Expired listings may
              be retained in our system for record-keeping or may be deleted at
              our discretion.
            </p>

            <p className="text-foreground leading-relaxed">
              Users are fully responsible for the accuracy, legality, and safety
              of their listings, including ensuring that any images uploaded do
              not infringe on copyrights or third-party rights. Other users may
              report listings they believe violate our guidelines. Desieasy does
              not pre-screen or verify listings and is not responsible for their
              accuracy, legality, or quality.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                4. Platform Role and Responsibility
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Desieasy functions solely as a neutral platform for users to
              connect, communicate, and share listings. Desieasy does not
              verify, endorse, or guarantee any users, listings, products,
              services, or transactions posted or conducted through the
              platform. Users are solely responsible for any interactions or
              agreements made through the platform, whether within chat or
              off-platform.
            </p>

            <p className="text-foreground leading-relaxed">
              Desieasy is not liable for any loss, damage, dispute, or legal
              issue that may arise between users as a result of using the
              platform.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                5. Content Guidelines
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Users must ensure that all content posted on Desieasy, including
              text, images, and service offerings, complies with community
              standards and applicable laws. The following are strictly
              prohibited:
            </p>

            <ul className="space-y-2 text-foreground ml-4 mb-6">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Hate speech, discrimination, or harassment
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Adult content, sexually explicit material, or escort-related
                services
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Scams, misleading claims, or fraudulent listings
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Promotion of illegal goods, services, or activities
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Attempts to buy, sell, or distribute copyrighted or pirated
                content
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Any content that endangers safety, promotes violence, or misuses
                Desieasy for harmful intent
              </li>
            </ul>

            <p className="text-foreground leading-relaxed">
              Desieasy reserves the right to remove any content that violates
              these guidelines, even if not explicitly listed above. Repeated or
              severe violations may result in account suspension or permanent
              banning.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                6. Prohibited Use
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Users must not misuse the platform in any way. The following
              activities are strictly prohibited:
            </p>

            <ul className="space-y-2 text-foreground ml-4 mb-6">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Violating any local, state, or federal laws
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Posting scams, false information, or misleading content
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Uploading adult or sexually explicit content
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Promoting or attempting to sell illegal goods or services
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Engaging in hate speech, threats, or discriminatory behavior
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Attempting to impersonate or harm other users
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Scraping data, sending spam, or accessing the platform without
                authorization
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Disrupting, interfering with, or attempting to reverse-engineer
                platform operations
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Uploading copyrighted materials without proper rights or
                authorization
              </li>
            </ul>

            <p className="text-foreground leading-relaxed">
              Violations may result in listing removal, account suspension, or
              permanent banning at Desieasy's sole discretion.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                7. Category Disclaimers
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-6">
              Desieasy provides listing functionality across various categories.
              Users are solely responsible for their posts, interactions, and
              any outcomes. Desieasy does not participate in or mediate user
              transactions or agreements.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Accommodations
                </h3>
                <p className="text-foreground leading-relaxed ml-4">
                  Users must verify listings and use caution when discussing
                  deposits, payments, or rental agreements. Desieasy is not
                  liable for false listings, advance payment scams, or disputes
                  between tenants and property owners.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Jobs
                </h3>
                <p className="text-foreground leading-relaxed ml-4">
                  Desieasy does not verify job posts or validate legal hiring
                  status. Users are responsible for ensuring that job
                  arrangements comply with applicable employment and immigration
                  laws. Desieasy is not involved in hiring, payment, or
                  verification processes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Marketplace
                </h3>
                <p className="text-foreground leading-relaxed ml-4">
                  Desieasy is not responsible for the authenticity, condition,
                  legality, or quality of any item or service posted. Fake
                  products, misleading deals, or scams are at the risk of the
                  buyer and seller. Users must not list prohibited services such
                  as adult work, nude video calls, escorting, or any illegal
                  activity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Rides
                </h3>
                <p className="text-foreground leading-relaxed ml-4">
                  Users may offer or request rides through the platform.
                  Desieasy does not facilitate, verify, or regulate any ride
                  arrangements or communication. All transportation agreements
                  and interactions are strictly between users, and Desieasy is
                  not liable for any issues, disputes, or outcomes related to
                  ride sharing.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                8. Chat and Communication
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Desieasy provides a built-in messaging feature to help users
              connect regarding listings. This communication is strictly the
              responsibility of the users involved. Desieasy does not monitor,
              moderate, or verify messages exchanged between users, and is not
              liable for the content, accuracy, or outcomes of these
              communications. Users are prohibited from using the chat feature
              to send spam, abuse, illegal offers, or any content that violates
              our guidelines. Violations may result in account suspension or
              removal.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                9. Data Collection and Privacy
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Desieasy collects limited personal information necessary to
              operate the platform. By using the platform, users agree to the
              collection and use of their information as described in our
              Privacy Policy. Users may request account deletion or data removal
              at any time by contacting support@desieasy.com.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                10. Third-Party Links and Advertisements
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Desieasy may display advertisements and third-party links on the
              platform. These ads and links may direct users to external
              websites or services that are not owned or controlled by Desieasy.
              Desieasy does not endorse or guarantee the products, services, or
              content offered by third parties. Users access external sites and
              engage with third-party advertisers at their own risk.
            </p>

            <p className="text-foreground leading-relaxed">
              Desieasy is not responsible for any loss, damage, or disputes
              resulting from interactions with third-party content.
            </p>
          </div>

          {/* Section 11 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                11. Termination
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Desieasy reserves the right to suspend or terminate user accounts
              at its sole discretion, with or without notice, and for any
              reason, including but not limited to violations of these Terms or
              misuse of the platform. Terminated accounts may have their data
              retained for record-keeping or legal purposes unless the user
              requests deletion. Users may request account deletion at any time
              by contacting support@desieasy.com.
            </p>
          </div>

          {/* Section 12 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                12. Limitation of Liability
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Desieasy provides the platform on an "as-is" and "as-available"
              basis without any warranties or guarantees. Desieasy makes no
              representations regarding the accuracy, reliability, or
              availability of the platform or the content posted by users. Users
              agree that Desieasy shall not be liable for any direct, indirect,
              incidental, or consequential damages arising from the use of the
              platform, including but not limited to disputes between users,
              loss of data, financial loss, or unauthorized access to user
              information.
            </p>
          </div>

          {/* Section 13 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                13. Governing Law
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              applicable laws. Any disputes arising from or relating to the use
              of Desieasy shall be resolved in accordance with the laws in the
              jurisdiction where the platform operator is legally established at
              the time of dispute.
            </p>
          </div>

          {/* Section 14 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                14. Copyright and Content Ownership
              </h2>
            </div>

            <p className="text-foreground leading-relaxed">
              Users retain ownership of the content they submit to Desieasy,
              including listings, images, and other materials. By posting
              content on the platform, users grant Desieasy a non-exclusive,
              worldwide, royalty-free license to use, display, and share such
              content in connection with the platform's operation and promotion.
              Users are responsible for ensuring that any content they submit
              does not infringe on copyrights, trademarks, or other intellectual
              property rights of third parties. Desieasy reserves the right to
              remove any content that violates intellectual property laws or
              these Terms.
            </p>
          </div>

          {/* Section 15 */}
          <div className="mb-10">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                15. Updates to This Agreement
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Desieasy may update or modify these Terms at any time. When
              changes are made, the "Last Updated" date at the top of this page
              will be revised accordingly.
            </p>

            <p className="text-foreground leading-relaxed">
              Users are responsible for reviewing the Terms regularly. Continued
              use of the platform after any changes constitutes acceptance of
              the updated Terms.
            </p>
          </div>

          {/* Section 16 - Contact */}
          <div className="mb-8">
            <div className="border-b border-border pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                16. Contact
              </h2>
            </div>

            <p className="text-foreground leading-relaxed mb-6">
              For any questions or concerns about this User Agreement, please
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
    </div>
  );
};

export default UserAgreement;
