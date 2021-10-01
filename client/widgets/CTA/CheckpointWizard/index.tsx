import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { RegularStepFragment } from '👨‍💻generated/graphql';
import Jest from '👨‍💻widgets/CTA/CheckpointWizard/jest';
import Match from '👨‍💻widgets/CTA/CheckpointWizard/match';
import Output from '👨‍💻widgets/CTA/CheckpointWizard/output';
import Select from '👨‍💻widgets/CTA/CheckpointWizard/select';

enum CheckpointWizardStepEnum {
  jest = 'jest',
  match = 'match',
  output = 'output',
  select = 'select',
}

const CheckpointWizard: React.FC<Props> = ({ selectFile, step }) => {
  const [wizardStep, setWizardStep] = useState<
    keyof typeof CheckpointWizardStepEnum
  >('select');

  return (
    <div className="opacity-0 invisible mb-1 group-hover:mb-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 bottom-full bg-bg-nav text-text-primary p-4 rounded-lg md:w-72 md:transform">
      <motion.div
        animate={{ display: wizardStep === 'select' ? 'block' : 'none' }}
      >
        <Select setWizardStep={setWizardStep} />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'match' ? 'block' : 'none' }}
      >
        <Match
          selectFile={selectFile}
          setWizardStep={setWizardStep}
          step={step}
        />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'output' ? 'block' : 'none' }}
      >
        <Output setWizardStep={setWizardStep} />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'jest' ? 'block' : 'none' }}
      >
        <Jest setWizardStep={setWizardStep} />
      </motion.div>
    </div>
  );
};

type Props = {
  selectFile?: React.Dispatch<React.SetStateAction<string | null>>;
  step: RegularStepFragment;
};

export default CheckpointWizard;
