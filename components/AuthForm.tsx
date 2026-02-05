'use client';

import { useState, useEffect } from 'react';
import {
  useAuth,
  initiateAnonymousSignIn,
} from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function AuthForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup reCAPTCHA verifier
  useEffect(() => {
    if (!auth || window.recaptchaVerifier) return;
    
    // Using an invisible reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });

    return () => {
        // Cleanup
        window.recaptchaVerifier?.clear();
    };

  }, [auth]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!auth) {
        setError("Authentication service is not available.");
        setIsLoading(false);
        return;
    }

    if (phone.length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        setIsLoading(false);
        return;
    }
    
    const phoneNumber = `+91${phone}`;
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
        setError("reCAPTCHA verifier is not initialized.");
        setIsLoading(false);
        return;
    }

    try {
        window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setOtpSent(true);
        toast({ title: "OTP Sent!", description: `An OTP has been sent to ${phoneNumber}.`});
    } catch (err: any) {
        console.error("Error sending OTP:", err);
        setError(`Failed to send OTP. Please try again. (${err.code})`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!window.confirmationResult) {
        setError("Could not verify OTP. Please request a new one.");
        setIsLoading(false);
        return;
    }
     if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP.");
        setIsLoading(false);
        return;
    }

    try {
        await window.confirmationResult.confirm(otp);
        // User is signed in. The onAuthStateChanged listener in FirebaseProvider will handle the rest.
        toast({ title: "Success!", description: "You are now logged in." });
    } catch (err: any) {
         console.error("Error verifying OTP:", err);
         setError(`Invalid OTP. Please try again. (${err.code})`);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAnonymousSignIn = () => {
    if (auth) {
      initiateAnonymousSignIn(auth);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div id="recaptcha-container"></div>
      <Card>
        <CardHeader>
          <CardTitle>{otpSent ? 'Enter OTP' : 'Login or Sign Up'}</CardTitle>
          <CardDescription>
            {otpSent 
                ? `We've sent a 6-digit OTP to +91 ${phone}`
                : 'Enter your mobile number to receive an OTP.'
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <CardContent className="space-y-4">
             {!otpSent ? (
                <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex items-center">
                            <span className="inline-block p-2 border border-r-0 rounded-l-md bg-gray-100 text-sm">+91</span>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="98765 43210"
                                required
                                className="rounded-l-none"
                                disabled={isLoading}
                            />
                    </div>
                </div>
             ) : (
                <div className="space-y-2">
                    <Label htmlFor="otp">6-Digit OTP</Label>
                    <Input
                        id="otp"
                        type="tel"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        required
                        className="tracking-widest text-center"
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
             )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : (otpSent ? 'Verify OTP' : 'Send OTP')}
            </Button>
            
            <div className="relative w-full flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                </div>
                <p className="relative bg-card px-2 text-xs text-center text-gray-500">or</p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
            >
              Continue as Guest
            </Button>

             {otpSent && (
                <button
                    type="button"
                    className="text-sm text-primary hover:underline mt-2"
                    onClick={() => {
                        setOtpSent(false);
                        setError(null);
                        setOtp('');
                    }}
                    disabled={isLoading}
                >
                    Change mobile number
                </button>
             )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    