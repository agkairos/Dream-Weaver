export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          textDecoration: "none",
          fontSize: "0.95rem",
        }}
      >
        ← Back to Home
      </a>

      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy explains how information is collected, used, and
        protected when you visit this website.
      </p>

      <p>
        By accessing or using this website, you agree to the terms described in
        this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>

      <p>
        This website does <strong>not collect personal information directly</strong>,
        such as names, email addresses, or account credentials.
      </p>

      <p>
        However, we may collect non-personal information automatically through
        third-party services, including:
      </p>

      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited</li>
        <li>Time spent on pages</li>
        <li>Device and usage data</li>
      </ul>

      <p>
        This information is collected in an anonymous and aggregated form and is
        used solely for analytics and website improvement purposes.
      </p>

      <h2>2. Google Analytics</h2>

      <p>
        This website uses <strong>Google Analytics</strong>, a web analytics
        service provided by Google Inc.
      </p>

      <p>
        Google Analytics uses cookies and similar technologies to analyze how
        visitors use the site.
      </p>

      <p>
        Learn more:
        <br />
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://policies.google.com/privacy
        </a>
      </p>

      <h2>3. Google AdSense</h2>

      <p>
        This website uses <strong>Google AdSense</strong>, an advertising service
        provided by Google.
      </p>

      <p>
        Google may use cookies, including the DoubleClick cookie, to display ads
        relevant to users.
      </p>

      <p>
        Ad settings:
        <br />
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://adssettings.google.com
        </a>
      </p>

      <h2>4. Cookies</h2>

      <p>
        Cookies are small text files stored on a user's device. This website uses
        cookies for analytics, advertising, and improving user experience.
      </p>

      <h2>5. Data Sharing</h2>

      <p>
        This website does not sell or share personal data. Data is handled only
        by Google Analytics and Google AdSense under their policies.
      </p>

      <h2>6. Third-Party Links</h2>

      <p>
        We are not responsible for the privacy practices of external websites.
      </p>

      <h2>7. Data Security</h2>

      <p>
        Reasonable measures are taken to protect the website and its integrity.
      </p>

      <h2>8. Changes</h2>

      <p>
        This Privacy Policy may be updated periodically.
      </p>

      <h2>9. Contact</h2>

      <p>
        If you have questions, please contact us through the Contact page.
      </p>

      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        Last updated: {new Date().toLocaleDateString("en-US")}
      </p>
    </main>
  );
}
