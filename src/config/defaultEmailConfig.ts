import { EmailConfig } from '../types';

export const defaultEmailConfig: EmailConfig = {
  provider: 'mailto',
  fromEmail: 'quotes@yourshop.com',
  apiEndpoint: 'http://localhost:4000/send-email',
  apiKey: ''
};
