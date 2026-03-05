export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = 'Le nom est obligatoire.';
  }

  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.';
  }

  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
