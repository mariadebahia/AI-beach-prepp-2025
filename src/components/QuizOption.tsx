import React from 'react';

type QuizOptionProps = {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  name: string;
};

const QuizOption: React.FC<QuizOptionProps> = ({ id, text, isSelected, onSelect, name }) => {
  return (
    <div
      className={`p-4 mb-3 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onSelect}
    >
      <label htmlFor={id} className="flex items-center cursor-pointer w-full">
        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
          isSelected ? 'border-blue-600' : 'border-gray-300'
        }`}>
          {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
        </div>
        <span className="text-gray-800">{text}</span>
      </label>
      <input
        type="radio"
        id={id}
        name={name}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
    </div>
  );
};