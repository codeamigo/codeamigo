import React, { useRef } from 'react';

import Button from '👨‍💻components/Button';
import CTA from '👨‍💻widgets/CTA';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';

import { Props as OwnProps } from '.';

const RijuTemplate: React.FC<Props> = (props) => {
  const { files, filesRef, loading, nextStep, step } = props;
  const rijuRef = useRef<HTMLIFrameElement>(null);

  const postCodeToRiju = () => {
    rijuRef.current?.contentWindow?.postMessage(
      {
        code: 'puts "hello world"\n',
        event: 'runCode',
      },
      '*'
    );
  };

  return (
    <div className="sp-wrapper">
      <div className="sp-layout">
        <div
          className="md:w-48 w-2/6 flex flex-col justify-between bg-bg-primary z-50 border-bg-nav-offset-faded border-r sm:border-b-0"
          ref={filesRef}
          style={{ minHeight: '20rem' }}
        >
          <div className="h-full">
            <EditorFiles
              activePath={''}
              codeModules={step.codeModules}
              stepId={step.id}
              {...props}
              files={files!}
              selectFile={() => {
                console.log('TODO');
              }}
            />
          </div>
          <div className="p-2">
            <Button onClick={postCodeToRiju}>TODO</Button>
            {/* <CTA {...props} loading={loading} nextStep={nextStep} step={step} /> */}
          </div>
        </div>
        <iframe
          className="w-full h-full"
          ref={rijuRef}
          src="https://riju.codeamigo.xyz/ruby"
        />
      </div>
    </div>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default RijuTemplate;
