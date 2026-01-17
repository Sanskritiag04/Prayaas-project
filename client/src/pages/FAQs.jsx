import React from "react";
import "./FAQs.css";

export default function FAQs() {
  return (
    <div className="faq-container">

      <h2>Frequently Asked Questions</h2>

      <div className="faq-box">
        <h4>1. What is Prayaas?</h4>
        <p>
          Prayaas is a volunteering platform where people can participate in
          social activities and contribute to society.
        </p>
      </div>

      <div className="faq-box">
        <h4>2. How can I register as a volunteer?</h4>
        <p>
          Go to the Register page, fill in your details and submit the form.
        </p>
      </div>

      <div className="faq-box">
        <h4>3. Is registration free?</h4>
        <p>
          Yes, registration is completely free for volunteers.
        </p>
      </div>

      <div className="faq-box">
        <h4>4. Can NGOs register?</h4>
        <p>
          Yes, NGOs can register using the NGO registration form.
        </p>
      </div>

      <div className="faq-box">
        <h4>5. How do I contact support?</h4>
        <p>
          You can contact us through the About page.
        </p>
      </div>

    </div>
  );
}
