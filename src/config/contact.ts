// The one place contact details live. Everything here is a placeholder for a fictional brand.
export const contact = {
  actionsEnabled: false,
  // Placeholder details stay hidden unless SHOW_CONTACT=1 (local review only).
  showDetails: import.meta.env.SHOW_CONTACT === '1',
  phoneDisplay: '+000 00-000-0000',
  phoneE164: '+000000000000',
  whatsappDigits: '000000000000',
  email: 'hello@example.com',
  // Set to true and supply real details to enable click-to-chat in your own build.
  whatsappEnabled: false,
};

// wa.me link with a draft message in the page's language.
export const waLink = (text: string) => `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(text)}`;
