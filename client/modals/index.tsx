import { Transition } from '@headlessui/react';
import React, { useCallback, useEffect } from 'react';

import Icon from '👨‍💻components/Icon';
import ChangePassword from '👨‍💻modals/ChangePassword';
import CreateLesson from '👨‍💻modals/CreateLesson';
import Donate from '👨‍💻modals/Donate';
import DonationFailure from '👨‍💻modals/DonationFailure';
import DonationSuccess from '👨‍💻modals/DonationSuccess';
import LessonFinished from '👨‍💻modals/LessonFinished';
import Login from '👨‍💻modals/Login';
import Register from '👨‍💻modals/Register';
import RegisterAfterPreview from '👨‍💻modals/RegisterAfterPreview';
import ResetPasswordSent from '👨‍💻modals/ResetPasswordSent';
import TestsPassed from '👨‍💻modals/TestsPassed';
import UpdateSession from '👨‍💻modals/UpdateSession';

import { InitialModalState, modalVar } from '../apollo/cache/modal';
import { useModalQuery } from '../generated/graphql';

const Modals: React.FC<Props> = () => {
  const { data } = useModalQuery();

  const handleEscape = useCallback((event) => {
    if (event.keyCode === 27) modalVar(InitialModalState);
  }, []);

  useEffect(() => {
    if (data?.modal?.name)
      document.addEventListener('keydown', handleEscape, false);
    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [data?.modal?.name]);

  const isOpen = !!data?.modal?.name;

  return isOpen ? (
    <div className="overflow-y-auto fixed inset-0 z-10">
      <div className="flex sm:block justify-center items-end sm:p-0 px-4 pt-4 pb-20 min-h-screen text-center">
        {/* Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0" */}
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={isOpen}
        >
          <div
            aria-hidden="true"
            className="fixed inset-0 opacity-50 transition-opacity bg-bg-nav"
            onClick={() => modalVar(InitialModalState)}
          >
            <div className="absolute inset-0 opacity-75"></div>
          </div>
        </Transition>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          aria-hidden="true"
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
        >
          &#8203;
        </span>
        {/* Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" */}
        <div
          aria-labelledby="modal-headline"
          aria-modal="true"
          className="inline-block sm:my-8 text-left align-bottom sm:align-middle rounded-lg shadow-xl transition-all transform bg-bg-primary"
          role="dialog"
        >
          <div
            className="flex absolute -top-3 -right-3 justify-center items-center w-10 h-10 rounded-full bg-bg-primary"
            onClick={() => modalVar(InitialModalState)}
          >
            <Icon
              className="text-3xl text-text-primary"
              name="cancel-circled"
            />
          </div>
          {/* eslint-disable */}
          {data?.modal?.name === 'changePassword' && <ChangePassword />}
          {data?.modal?.name === 'createLesson' && <CreateLesson />}
          {data?.modal?.name === 'donate' && <Donate />}
          {data?.modal?.name === 'donationSuccess' && <DonationSuccess />}
          {data?.modal?.name === 'donationFailure' && <DonationFailure />}
          {data?.modal?.name === 'lessonFinished' && <LessonFinished />}
          {data?.modal?.name === 'login' && <Login />}
          {data?.modal?.name === 'register' && <Register />}
          {data?.modal?.name === 'registerAfterPreview' && <RegisterAfterPreview />}
          {data?.modal?.name === 'resetPasswordSent' && <ResetPasswordSent />}
          {data?.modal?.name === 'testsPassed' && <TestsPassed />}
          {data?.modal?.name === 'updateSession' && <UpdateSession />}
          {/* eslint-enable */}
        </div>
      </div>
    </div>
  ) : null;
};

type Props = {};

export default Modals;
