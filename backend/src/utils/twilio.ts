/**
 * Mock utility for Twilio Masked Calling.
 */
export const initiateMaskedCall = async (from: string, to: string) => {
  console.log(`Initiating masked call from ${from} to ${to} via Twilio Proxy Service.`);
  // In production, this would use:
  // client.proxy.v1.services('KSxxx').sessions.create({...})
  return {
    sid: `ca_${Math.random().toString(36).substr(2, 9)}`,
    maskedNumber: '+91 99999 00000', // Proxy number shown to user
    status: 'initiated'
  };
};

/**
 * Sends a masked SMS.
 */
export const sendMaskedSMS = async (to: string, body: string) => {
  console.log(`Sending masked SMS to ${to}: ${body}`);
  return {
    sid: `sm_${Math.random().toString(36).substr(2, 9)}`,
    status: 'queued'
  };
};
