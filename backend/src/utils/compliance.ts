import crypto from 'crypto';

/**
 * Hashes an Aadhaar number with a salt to ensure DPDP Act compliance.
 * Never store the raw Aadhaar number.
 */
export const hashAadhaar = (aadhaarNumber: string): string => {
  const salt = process.env.AADHAAR_SALT || 'default-salt-for-dev';
  return crypto.createHmac('sha256', salt).update(aadhaarNumber).digest('hex');
};

/**
 * Simulates an e-KYC verification with UIDAI.
 */
export const verifyWithUIDAI = async (aadhaarNumber: string, otp: string) => {
  // In a real scenario, this would call an authorized AUA/KSA provider.
  console.log(`Simulating UIDAI verification for Aadhaar: ${aadhaarNumber.slice(-4)}`);
  return {
    success: true,
    name: 'Verified User',
    dob: '1995-01-01',
    gender: 'M'
  };
};
