import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import toast from "react-hot-toast";
import { TOKEN_MAP, SplToken } from '@/types/Token';
import { ClassicGameOptions } from '@/types';
import createClassic from '@/utils/api/classic/create';
import { COLLECTION_NAME_MAP, LEAGUE_NAME_MAP } from '@/utils/nameMap';

const CreatePool: React.FC = () => {
  const [title, setTitle] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [description, setDescription] = useState('');
  const [gameTime, setGameTime] = useState('');
  const [token, setToken] = useState<SplToken | 'SOL' | ''>('');
  const [contractAddress, setContractAddress] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      title.trim() !== '' &&
      team1.trim() !== '' &&
      team2.trim() !== '' &&
      gameTime !== '' &&
      token !== ''
    );
  }, [title, team1, team2, gameTime, token]);

  const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = e.target.value as SplToken | 'SOL';
    setToken(selectedToken);
    if (selectedToken === 'SOL') {
      setContractAddress('Native SOL');
    } else if (TOKEN_MAP[selectedToken as SplToken]) {
      setContractAddress(TOKEN_MAP[selectedToken as SplToken].publicKey.toString());
    } else {
      setContractAddress('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const options: ClassicGameOptions = {
      league: "Custom",
      team1Name: team1,
      team2Name: team2,
      title: title,
      description: description || " ",
      gameTime: gameTime,
      collection: Object.values(COLLECTION_NAME_MAP)[0],
      token: token as SplToken | 'SOL',
    };

    toast.promise(
      createClassic(options),
      {
        loading: 'Creating pool...',
        success: (data) => {
          console.log('Pool created successfully:', data);
          return 'Pool created successfully!';
        },
        error: (err: Error) => {
          console.error('Error creating pool:', err);
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const inputClasses = `
    bg-greyscale6 hover:bg-greyscale1/10 rounded-[10px] p-[10px] w-full 
    text-greyscale1 focus:outline-none focus:ring-2 focus:ring-data focus:bg-greyscale1/10
    placeholder-greyscale4
  `;

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-greyscale1 text-[18px] font-bold">Create Pool</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Title*</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            placeholder="Big3 Season Opener"
            required
          />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Team 1*</label>
          <input
            type="text"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className={inputClasses}
            placeholder="Killer3s"
            required
          />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Team 2*</label>
          <input
            type="text"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className={inputClasses}
            placeholder="Trilogy"
            required
          />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses}
            placeholder="If you need more room to explain..."
            rows={3}
          />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Game Time (EDT)*</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              className={`${inputClasses} pr-8`}
              required
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Image src="/images/icons/new/calendar.png" width={20} height={20} alt="Calendar" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Token*</label>
          <select
            value={token}
            onChange={handleTokenChange}
            className={`${inputClasses} appearance-none`}
            required
          >
            <option value="" disabled className="text-greyscale4">Select a token</option>
            <option value="SOL" className="text-greyscale1 bg-greyscale6">SOL</option>
            {(Object.keys(TOKEN_MAP) as SplToken[]).map((tokenName) => (
              <option key={tokenName} value={tokenName} className="text-greyscale1 bg-greyscale6">
                {tokenName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-greyscale4 text-xs">Contract Address</label>
          <div className="flex items-center bg-greyscale6 hover:bg-greyscale1/10 rounded-[10px]">
            <input
              type="text"
              value={contractAddress}
              readOnly
              className={`${inputClasses} bg-transparent`}
              placeholder="Contract address will be filled automatically"
            />
            <div className="mr-2">
              <Image src="/images/icons/new/mother.png" width={24} height={24} alt="MOTHER" />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full p-2.5 bg-data text-black rounded-[10px] text-sm 
            hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={!isFormValid}
        >
          Create pool
        </button>
      </form>
    </div>
  );
};

export default CreatePool;