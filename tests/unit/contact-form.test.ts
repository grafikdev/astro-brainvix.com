import { describe, it, expect } from 'vitest';
import { validateContactForm } from '../../src/utils/contact-form';

describe('validateContactForm', () => {
  it('accepte un formulaire valide', () => {
    const result = validateContactForm({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: 'Bonjour, je souhaite une démonstration du BCD.',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejette un nom vide', () => {
    const result = validateContactForm({
      name: '',
      email: 'jean@example.com',
      message: 'Un message',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejette un email invalide', () => {
    const result = validateContactForm({
      name: 'Jean Dupont',
      email: 'pas-un-email',
      message: 'Un message',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('rejette un email vide', () => {
    const result = validateContactForm({
      name: 'Jean Dupont',
      email: '',
      message: 'Un message',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('rejette un message trop court (moins de 10 caractères)', () => {
    const result = validateContactForm({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: 'Bref.',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('rejette un message vide', () => {
    const result = validateContactForm({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('retourne toutes les erreurs en même temps', () => {
    const result = validateContactForm({ name: '', email: '', message: '' });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBe(3);
  });

  it('rejette les espaces seuls comme nom', () => {
    const result = validateContactForm({
      name: '   ',
      email: 'jean@example.com',
      message: 'Un message valide',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });
});
