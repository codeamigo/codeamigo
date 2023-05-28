import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QuizExecutionProvider from 'providers/execution/Quiz';
import RijuExecutionProvider from 'providers/execution/Riju';
import SandpackExecutionProvider from 'providers/execution/Sandpack';
import React from 'react';
import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { TokenUsageStatusType } from 'types';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  CheckpointsQuery,
  CodeModulesQuery,
  LessonDocument,
  LessonQueryVariables,
  Step,
  StepDocument,
  StepQueryVariables,
  useCheckpointsQuery,
  useCodeModulesQuery,
  useCreateUserLessonPurchaseMutation,
  useMeQuery,
  useUpdateTokensUsedMutation,
  useUpdateUserLessonLastSlugSeenMutation,
  useUserLessonPositionQuery,
  useUserLessonPurchaseQuery,
} from '👨‍💻generated/graphql';
import { LessonQuery } from '👨‍💻generated/graphql';
import { StepQuery } from '👨‍💻generated/graphql';
import { client } from '👨‍💻utils/withApollo';
import Credits from '👨‍💻widgets/Credits';
import ProgressBar from '👨‍💻widgets/ProgressBar';
import UserMenu from '👨‍💻widgets/UserMenu';

import * as hal from '../../../../../../assets/hal.png';
import { MAX_TOKENS_DEMO, MAX_TOKENS_USER } from '../../../../../../constants';

const transition = { bounce: 0.4, duration: 0.8, type: 'spring' };

const defaultLeftPanelHeight = {
  editor: 'calc(100% - 18rem)',
  instructions: '18rem',
};

const V2Lesson = ({ lesson, step }: Props) => {
  const [ready, setReady] = useState(false);
  const [loaderReady, setLoaderReady] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [maxTokens, setMaxTokens] = useState<number | null>(null);
  const [maxTokensUsed, setMaxTokensUsed] = useState<boolean>(false);
  const [tokenUsageStatus, setTokenUsageStatus] =
    useState<TokenUsageStatusType>('safe');
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [leftPanelHeight, setLeftPanelHeight] = useState(
    defaultLeftPanelHeight
  );
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [hoverSelection, setHoverSelection] = useState<string | null>(null);
  const [checkpoints, setCheckpoints] =
    useState<CheckpointsQuery['checkpoints']>();

  const router = useRouter();

  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: checkpointsData } = useCheckpointsQuery({
    variables: {
      stepId: step?.id as string,
    },
  });
  const { data: codeModulesData, loading } = useCodeModulesQuery({
    variables: {
      stepId: step?.id as string,
    },
  });
  const { data: userLessonPositionData } = useUserLessonPositionQuery({
    variables: {
      lessonId: lesson?.id as string,
    },
  });
  const { data: userLessonPurchaseData, loading: userLessonPurchaseLoading } =
    useUserLessonPurchaseQuery({
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        lessonId: lesson?.id as string,
      },
    });

  const [updateUserLessonLastSlugSeen] =
    useUpdateUserLessonLastSlugSeenMutation();
  const [
    createUserLessonPurchase,
    { loading: createUserLessonPurchaseLoading },
  ] = useCreateUserLessonPurchaseMutation();
  const [updateUserTokensUsed] = useUpdateTokensUsedMutation();

  const files = codeModulesData?.codeModules?.reduce((acc, codeModule) => {
    if (!codeModule.name) return acc;
    if (!codeModule.code) return acc;

    return {
      ...acc,
      [codeModule.name]: { code: codeModule.code.replace(/\\n/g, '\n') },
    };
  }, {});

  // First modal
  useEffect(() => {
    if (userLessonPurchaseLoading) return;
    if (meLoading) return;

    // if (
    //   !userLessonPurchaseData?.userLessonPurchase?.id &&
    //   router.query.payment !== 'success' &&
    //   lesson?.requiresPayment &&
    //   (step?.position || 0) > 4
    // ) {
    //   if (!meData?.me) {
    //     modalVar({
    //       callback: () => null,
    //       data: {
    //         purchaseRequired: true,
    //       },
    //       name: 'login',
    //       persistent: true,
    //     });
    //     return;
    //   }

    //   modalVar({
    //     callback: () => null,
    //     data: {
    //       cancelUrl: window.location.href,
    //       lessonId: lesson?.id,
    //       successUrl: window.location.href,
    //       title: lesson?.title,
    //       userId: meData?.me?.id,
    //     },
    //     name: 'lessonPurchase',
    //     persistent: true,
    //   });

    //   return;
    // }

    if (!isDesktop) {
      modalVar({
        callback: () => null,
        name: 'mobileWarning',
        persistent: true,
      });
    }
  }, [
    lesson,
    step?.id,
    meLoading,
    isDesktop,
    router.query,
    userLessonPurchaseLoading,
    createUserLessonPurchaseLoading,
    userLessonPurchaseData?.userLessonPurchase?.id,
  ]);

  useEffect(() => {
    (async () => {
      if (router.query.payment === 'success' && router.query.session_id) {
        const stripeSessionId =
          typeof router.query.session_id === 'string'
            ? router.query.session_id
            : router.query.session_id[router.query.session_id.length - 1];
        await createUserLessonPurchase({
          refetchQueries: ['UserLessonPurchase'],
          variables: {
            lessonId: lesson?.id as string,
            stripeSessionId,
          },
        });
        router.push(`/v2/lesson/${lesson?.slug}/step/${step?.slug}`);
      }
    })();
  }, [router.query]);

  useEffect(() => {
    setLeftPanelHeight(defaultLeftPanelHeight);
  }, [step?.id]);

  useEffect(() => {
    if (
      meData?.me?.isAuthenticated &&
      userLessonPositionData?.userLessonPosition
    ) {
      updateUserLessonLastSlugSeen({
        variables: {
          lastSlugSeen: step?.slug as string,
          lessonId: lesson?.id as string,
        },
      });
    }
  }, [step?.id]);

  useEffect(() => {
    if (!checkpoints) return;

    const allPassed = checkpoints.every((checkpoint) => checkpoint.isCompleted);

    const hasCheckpoint = checkpoints.length > 0;
    const allPassedOrNoCheckpoints = allPassed || !hasCheckpoint;

    setIsStepComplete(allPassedOrNoCheckpoints);
  }, [step?.id, checkpoints]);

  useEffect(() => {
    if (!checkpointsData?.checkpoints) return;

    setCheckpoints(checkpointsData.checkpoints);

    const nextCheckpoint = checkpointsData.checkpoints?.findIndex(
      (checkpoint) => {
        return !checkpoint.isCompleted;
      }
    );

    if (nextCheckpoint === undefined) return;

    if (nextCheckpoint >= 0) {
      setCurrentCheckpoint(nextCheckpoint);
    }
  }, [checkpointsData, step?.id]);

  useEffect(() => {
    let timeout: any;
    if (loaderReady && editorReady) {
      timeout = setTimeout(() => {
        setReady(true);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [editorReady, loaderReady]);

  useEffect(() => {
    if (meLoading) return;
    if (tokensUsed === null) return;
    if (meData?.me?.isAuthenticated) {
      updateUserTokensUsed({
        refetchQueries: ['Me'],
        variables: {
          tokensUsed,
        },
      });
    }

    const maxTokens = meData?.me?.isAuthenticated
      ? MAX_TOKENS_USER
      : MAX_TOKENS_DEMO;

    localStorage.setItem('codeamigo-tokens-used', tokensUsed.toString());
    setMaxTokens(maxTokens);
    setMaxTokensUsed(tokensUsed >= maxTokens);

    let tokenUsageStatus: TokenUsageStatusType = 'safe';
    if (tokensUsed > 0.5 * maxTokens) tokenUsageStatus = 'warning';
    if (tokensUsed > 0.75 * maxTokens) tokenUsageStatus = 'danger';
    setTokenUsageStatus(tokenUsageStatus);
  }, [tokensUsed, meLoading, meData?.me]);

  useEffect(() => {
    if (meLoading) return;

    setTokensUsed(
      parseInt(
        meData?.me?.tokensUsed.toString() ||
          localStorage.getItem('codeamigo-tokens-used') ||
          '0'
      )
    );
  }, [meData?.me, meLoading]);

  return (
    <AnimatePresence>
      <motion.div
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        className="flex w-full flex-col items-center justify-center gap-1.5 p-5 pt-2 md:h-full"
        initial={{ opacity: 0, scale: 0 }}
        key="v2"
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        {/* top bar */}
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="text-neutral-600 transition-colors hover:text-white"
              name="home"
              onClick={() => {
                router.push(`/`);
              }}
            />
            <ProgressBar
              checkpoints={checkpoints}
              lessonSlug={lesson?.slug as string}
              step={step as Step}
              steps={lesson?.steps as Pick<Step, 'slug' | 'title'>[]}
              title={lesson?.title as string}
              userLessonPosition={userLessonPositionData?.userLessonPosition}
            />
          </div>
          <div className="flex items-center gap-2">
            <Credits
              maxTokens={maxTokens}
              tokenUsageStatus={tokenUsageStatus}
              tokensUsed={tokensUsed}
            />
            <UserMenu />
          </div>
        </div>
        <div
          className="h-full overflow-hidden rounded-lg border border-neutral-800"
          style={{ width: '100%' }}
        >
          {step?.executionType === 'sandpack' ? (
            <SandpackExecutionProvider
              checkpoints={checkpoints as CheckpointsQuery['checkpoints']}
              codeModules={
                codeModulesData?.codeModules as CodeModulesQuery['codeModules']
              }
              currentCheckpoint={currentCheckpoint}
              files={files as { [key: string]: { code: string } }}
              hoverSelection={hoverSelection}
              isLessonPurchased={
                !!userLessonPurchaseData?.userLessonPurchase?.id
              }
              isLoggedIn={meData?.me?.isAuthenticated as boolean}
              isStepComplete={isStepComplete}
              leftPanelHeight={leftPanelHeight}
              lesson={lesson as LessonQuery['lesson']}
              loading={loading}
              maxTokensUsed={maxTokensUsed}
              onReady={() => setEditorReady(true)}
              setCheckpoints={setCheckpoints}
              setCurrentCheckpoint={setCurrentCheckpoint}
              setEditorReady={setEditorReady}
              setHoverSelection={setHoverSelection}
              setIsStepComplete={setIsStepComplete}
              setLeftPanelHeight={setLeftPanelHeight}
              setTokensUsed={setTokensUsed}
              step={step as Step}
              tokenUsageStatus={tokenUsageStatus}
              tokensUsed={tokensUsed}
            />
          ) : step?.executionType === 'riju' ? (
            <RijuExecutionProvider
              checkpoints={checkpoints as CheckpointsQuery['checkpoints']}
              codeModules={
                codeModulesData?.codeModules as CodeModulesQuery['codeModules']
              }
              currentCheckpoint={currentCheckpoint}
              files={files as { [key: string]: { code: string } }}
              hoverSelection={hoverSelection}
              isLessonPurchased={
                !!userLessonPurchaseData?.userLessonPurchase?.id
              }
              isLoggedIn={meData?.me?.isAuthenticated as boolean}
              isStepComplete={isStepComplete}
              leftPanelHeight={leftPanelHeight}
              lesson={lesson as LessonQuery['lesson']}
              loading={loading}
              maxTokensUsed={maxTokensUsed}
              onReady={() => setEditorReady(true)}
              setCheckpoints={setCheckpoints}
              setCurrentCheckpoint={setCurrentCheckpoint}
              setEditorReady={setEditorReady}
              setHoverSelection={setHoverSelection}
              setIsStepComplete={setIsStepComplete}
              setLeftPanelHeight={setLeftPanelHeight}
              setTokensUsed={setTokensUsed}
              step={step as Step}
              tokenUsageStatus={tokenUsageStatus}
              tokensUsed={tokensUsed}
            />
          ) : step?.executionType === 'quiz' ? (
            <QuizExecutionProvider
              lessonSlug={lesson?.slug as string}
              setEditorReady={setEditorReady}
              step={step as Step}
            />
          ) : null}
        </div>
      </motion.div>
      <motion.div
        animate={
          ready || !loaderReady
            ? { opacity: 0, scale: 0 }
            : { opacity: 1, scale: 1 }
        }
        className="fixed  left-0 top-0 flex h-full w-full animate-pulse items-center justify-center text-white"
        initial={{ opacity: 0.5, scale: 0.5 }}
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        <Image
          height={60}
          onLoad={() => setLoaderReady(true)}
          src={hal}
          width={60}
        />
      </motion.div>
    </AnimatePresence>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  step: StepQuery['step'];
};

export async function getServerSideProps(context: {
  params: { 'lesson-slug': string; 'step-slug': string };
}) {
  const lessonSlug = context.params['lesson-slug'];
  const stepSlug = context.params['step-slug'];

  const lesson = await client.query({
    query: LessonDocument,
    variables: { slug: lessonSlug } as LessonQueryVariables,
  });
  const step = await client.query({
    query: StepDocument,
    variables: { slug: stepSlug } as StepQueryVariables,
  });

  return {
    props: {
      lesson: lesson.data.lesson,
      step: step.data.step,
    },
  };
}

export default V2Lesson;
