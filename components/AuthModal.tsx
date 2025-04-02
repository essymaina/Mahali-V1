'use client';

import { useState, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from '../components/ui/dialog';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Auto-close after success (optional)
        // setTimeout(() => onClose(false), 5000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sign in to Mahali</DialogTitle>
          <DialogDescription>
            We'll send you a magic link to your email for a password-free sign in.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              required
              className="w-full"
            />
            
            {error && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center text-green-500 text-sm bg-green-50 p-3 rounded-md">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Check your email for the login link! You can close this dialog.</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || success || !email} 
              className="w-full"
            >
              {loading ? 'Sending...' : success ? 'Sent Successfully' : 'Send Login Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}