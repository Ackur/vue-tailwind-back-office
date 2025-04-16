export const events = {
  MO_SMS: {
    id: 'MO_SMS',
    text: 'Receive SMS',
    phone: true
  },
  DR_SMS: {
    id: 'DR_SMS',
    text: 'Receive SMS delivery report'
  },
  PDF_SMS: {
    id: 'PDF_SMS',
    text: 'Generate Registered SMS PDF'
  },
  DR_MMS: {
    id: 'DR_MMS',
    text: 'Receive MMS delivery report'
  },
  MO_MMS: {
    id: 'MO_MMS',
    text: 'Receive MMS',
    phone: true
  },
  PDF_MMS: {
    id: 'PDF_MMS',
    text: 'Generate Registered MMS PDF'
  }
}
export const actions = {
  CGI: {
    id: 'CGI',
    text: 'Send URL',
    events: ['MO_SMS', 'DR_SMS', 'PDF_SMS', 'DR_MMS', 'MO_MMS', 'PDF_MMS'],
    valueRule: 'url'
  },
  MAIL: {
    id: 'MAIL',
    text: 'Send email',
    events: ['MO_SMS', 'MO_MMS'],
    valueRule: 'email'
  },
  MAIL_CERT: {
    id: 'MAIL_CERT',
    text: 'Certify the delivery',
    events: ['MO_SMS', 'MO_MMS'],
    lang: true,
    valueRule: 'email'
  },
  MULTIMEDIA_OBJECT: {
    id: 'MULTIMEDIA_OBJECT',
    text: 'Multimedia object reply',
    events: ['MO_SMS', 'MO_MMS'],
    valueRule: 'required'
  },
  REDIRECT: {
    id: 'REDIRECT',
    text: 'Resend to phone',
    events: ['MO_SMS'],
    valueRule: 'phone'
  },
  RESP_AUTO_MMS: {
    id: 'RESP_AUTO_MMS',
    text: 'Multimedia obect automatic reply',
    events: ['MO_SMS', 'MO_MMS'],
    valueRule: 'required'
  },
  RESP_AUTO_SMS: {
    id: 'RESP_AUTO_SMS',
    text: 'Automatic text reply',
    events: ['MO_SMS', 'MO_MMS'],
    valueRule: 'required'
  }
}
export const languages = [
  { value: 'ES', name: 'Español' },
  { value: 'CA', name: 'Català' },
  { value: 'EU', name: 'Euskara' },
  { value: 'GL', name: 'Galego' },
  { value: 'AR', name: 'Español (Argentina)' },
  { value: 'EN', name: 'English' },
  { value: 'FR', name: 'Français' },
  { value: 'PT', name: 'Português' },
  { value: 'DE', name: 'Deutsch' },
  { value: 'IT', name: 'Italiano' },
  { value: 'NL', name: 'Nederlands' },
  { value: 'SE', name: 'Svenska' },
  { value: 'PL', name: 'Polski' }
]
