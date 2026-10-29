import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number; // 4 steps total
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="h-1 bg-[#4a2004] w-full">
      <div
        className="h-full bg-gradient-to-r from-[#fe6601] to-[#ff8c2e] transition-all duration-300 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};
