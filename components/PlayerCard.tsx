import React from 'react';

interface PlayerCardProps {
  image: string;
  name: string;
  team: string;
  number: string;
  background: string;
  highlights: string[];
  stats: any;
  onClose: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ image, name, team, number, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-md w-full glass rounded-3xl p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white">✕</button>
        <img src={image} alt={name} className="w-full rounded-2xl mb-4" />
        <h2 className="font-oswald italic font-black text-3xl uppercase text-white mb-2">{name}</h2>
        <p className="text-[#ccff00] text-xl">#{number} - {team}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
