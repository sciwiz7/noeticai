window.NOETIC_CONFIG = {
  links: {
    calendly: "https://calendly.com/office-noeticai/30min",
    audit: "contact.html?intent=audit",
    whatsapp: "https://wa.me/message/IYVLN6TJS2KHN1",
    email: "mailto:office.noeticai@gmail.com?subject=Noetic%20AI%20Inquiry",
    // TODO: Replace with the real LinkedIn company URL before launch.
    linkedin: ""
  },
  contactForm: {
    endpoint: "https://api.web3forms.com/submit",
    // TODO: Replace with the live Web3Forms access key before launch.
    // Configure Web3Forms to route submissions to office.noeticai@gmail.com.
    accessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
    subject: "New inquiry from Noetic AI website",
    fromName: "Noetic AI Website",
    successMessage: "Thanks. Your inquiry has been sent successfully and Noetic AI will follow up shortly.",
    missingKeyMessage: "The form UI is ready, but Web3Forms still needs the final access key before launch. For now, use WhatsApp, Email, or Book a Strategy Call.",
    errorMessage: "Something prevented the inquiry from sending. Please try again or use WhatsApp, Email, or Book a Strategy Call.",
    focusOptions: [
      "Free AI Presence Audit",
      "AI-Optimized Websites",
      "Automation & Lead Systems",
      "AI Presence Optimization",
      "General inquiry"
    ]
  }
};
