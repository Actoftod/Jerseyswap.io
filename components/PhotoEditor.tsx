import React from 'react';

interface PhotoEditorProps {
  image: string;
  teams: any[];
  selectedTeam: any;
  onTeamSelect: (team: any) => void;
  number: string;
  onNumberChange: (number: string) => void;
  removeBackground: boolean;
  onToggleBackground: () => void;
  onSwap: () => void;
  isProcessing: boolean;
  customPrompt?: string;
  onCustomPromptChange?: (prompt: string) => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  image,
  teams,
  selectedTeam,
  onTeamSelect,
  number,
  onNumberChange,
  removeBackground,
  onToggleBackground,
  onSwap,
  isProcessing,
  customPrompt,
  onCustomPromptChange
}) => {
  return (
    <div className="flex flex-col items-center pb-24 w-full">
      <div className="w-full max-w-sm aspect-[3/4] glass rounded-[3.5rem] overflow-hidden border border-white/10 mb-8">
        <img src={image} className="w-full h-full object-cover" alt="Preview" />
      </div>
      
      <div className="w-full max-w-sm space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">Team</label>
          <select 
            value={selectedTeam?.id || ''} 
            onChange={(e) => onTeamSelect(teams.find(t => t.id === e.target.value))}
            className="w-full p-4 glass rounded-xl text-white"
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 uppercase">Jersey Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="w-full p-4 glass rounded-xl text-white"
            placeholder="00"
            maxLength={2}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={removeBackground}
            onChange={onToggleBackground}
            className="w-5 h-5"
          />
          <span className="text-sm font-bold uppercase">Remove Background</span>
        </label>

        {onCustomPromptChange && (
          <div>
            <label className="block text-sm font-bold mb-2 uppercase">Custom Instructions</label>
            <textarea
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              className="w-full p-4 glass rounded-xl text-white resize-none"
              rows={3}
              placeholder="Optional custom instructions..."
            />
          </div>
        )}

        <button
          onClick={onSwap}
          disabled={isProcessing || !selectedTeam}
          className="w-full py-6 bg-[#ccff00] text-black font-oswald italic font-black text-2xl rounded-3xl uppercase disabled:opacity-50"
        >
          {isProcessing ? 'PROCESSING...' : 'EXECUTE_SWAP'}
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;
