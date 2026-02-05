import React from 'react';
import { UserProfile } from '../types';

interface OnboardingFlowProps {
  onComplete: (onboardingData: Partial<UserProfile>) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [name, setName] = React.useState('');
  const [handle, setHandle] = React.useState('');
  const [bio, setBio] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ name: name.toUpperCase(), handle, bio });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <h2 className="font-oswald italic font-black text-3xl uppercase text-[#ccff00] mb-8 text-center">
          CREATE_PROFILE
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="onboarding-name" className="block text-sm font-bold mb-2 uppercase">Name</label>
            <input
              id="onboarding-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 glass rounded-xl text-white"
              placeholder="Your Name"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="onboarding-handle" className="block text-sm font-bold mb-2 uppercase">Handle</label>
            <input
              id="onboarding-handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full p-4 glass rounded-xl text-white"
              placeholder="@username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="onboarding-bio" className="block text-sm font-bold mb-2 uppercase">Bio</label>
            <textarea
              id="onboarding-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 glass rounded-xl text-white resize-none"
              placeholder="Tell us about yourself..."
              rows={3}
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#ccff00] text-black font-oswald italic font-black text-xl rounded-xl uppercase"
          >
            CREATE_ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingFlow;
