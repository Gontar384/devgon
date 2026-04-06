export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '';
export const CONTACT_PHONE_FORMATTED = `${CONTACT_PHONE.slice(0, 3)} ${CONTACT_PHONE.slice(3, 6)} ${CONTACT_PHONE.slice(6, 9)} ${CONTACT_PHONE.slice(9)}`;
