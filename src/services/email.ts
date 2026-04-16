import { DocumentKind, EmailConfig, EmailProviderKind, JobCard } from '../types';

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export type SendEmailResult = {
  ok: boolean;
  provider: EmailProviderKind;
  status: 'drafted' | 'sent' | 'failed';
  error?: string;
};

export interface EmailProvider {
  kind: EmailProviderKind;
  send: (input: SendEmailInput) => Promise<SendEmailResult>;
}

export const buildEmailDraft = (job: JobCard, kind: DocumentKind, body: string) => {
  const subjectPrefix = kind === 'quote' ? '3D Print Quote' : '3D Print Invoice';
  const subject = `${subjectPrefix}: ${job.request.projectTitle}`;
  return { subject, body };
};

class MailtoEmailProvider implements EmailProvider {
  kind: EmailProviderKind = 'mailto';

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const mailto = `mailto:${encodeURIComponent(input.to)}?subject=${encodeURIComponent(
      input.subject
    )}&body=${encodeURIComponent(input.body)}`;

    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }

    return {
      ok: true,
      provider: this.kind,
      status: 'drafted'
    };
  }
}

class ApiEmailProvider implements EmailProvider {
  kind: EmailProviderKind = 'api';

  constructor(private readonly config: EmailConfig) {}

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    if (!this.config.apiEndpoint) {
      return {
        ok: false,
        provider: this.kind,
        status: 'failed',
        error: 'Missing API endpoint.'
      };
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {})
        },
        body: JSON.stringify({
          from: this.config.fromEmail,
          to: input.to,
          subject: input.subject,
          body: input.body
        })
      });

      if (!response.ok) {
        return {
          ok: false,
          provider: this.kind,
          status: 'failed',
          error: `Provider returned ${response.status}.`
        };
      }

      return {
        ok: true,
        provider: this.kind,
        status: 'sent'
      };
    } catch {
      return {
        ok: false,
        provider: this.kind,
        status: 'failed',
        error: 'Network error while sending email.'
      };
    }
  }
}

export const createEmailProvider = (config: EmailConfig): EmailProvider => {
  if (config.provider === 'api') {
    return new ApiEmailProvider(config);
  }

  return new MailtoEmailProvider();
};
