import { Menu, Transition } from '@headlessui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import useOnClickOutside from 'use-onclickoutside';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  useUpdateLessonThumbnailMutation,
} from '👨‍💻generated/graphql';

const Thumbnail: React.FC<Props> = ({ lesson }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [url, setUrl] = useState<string | null>(lesson?.thumbnail || null);

  const [updateThumbnail] = useUpdateLessonThumbnailMutation();

  if (!lesson) return null;

  useOnClickOutside(wrapperRef, () => {
    setShowOptions(false);
  });

  const saveImg = async (url: string) => {
    updateThumbnail({ variables: { id: lesson.id, thumbnail: url } });
  };

  const uploadImg = async (file: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sign_img_upload`
    );
    const { signature, timestamp } = await response.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'api_key',
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string
    );
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      { body: formData, method: 'POST' }
    );
    const data = await upload.json();

    saveImg(data.url);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);
    setUrl(url);

    uploadImg(file);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop,
  });

  return (
    <div ref={wrapperRef}>
      <div
        className="flex items-center text-sm text-text-primary cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        Thumbnail <Icon className="ml-1 text-text-primary" name="down-dir" />
      </div>
      <div className="relative z-10">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                aria-haspopup="true"
                className={`flex text-sm outline-none focus:outline-none`}
              >
                <span className="sr-only">Open lesson menu</span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={showOptions}
              >
                <div
                  aria-labelledby="session-menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-2 bg-bg-primary rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-left"
                  role="menu"
                >
                  <div className="p-3">
                    {url ? (
                      <div
                        className="relative w-56 h-36 bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url(${url})` }}
                      >
                        <div
                          className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
                          onClick={() => {
                            const yes = window.confirm(
                              'Are you sure you want to delete this thumbnail?'
                            );

                            if (yes) {
                              setUrl(null);
                              updateThumbnail({
                                variables: {
                                  id: lesson.id,
                                  thumbnail: undefined,
                                },
                              });
                            }
                          }}
                        >
                          <Icon className="text-text-primary" name="cancel" />
                        </div>
                      </div>
                    ) : (
                      <div
                        {...getRootProps()}
                        className={`w-56 h-36 flex flex-col items-center text-text-primary border-dashed p-6 border-2 ${
                          isDragActive
                            ? 'border-bg-nav'
                            : 'border-bg-nav-offset'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div>
                          <Icon
                            className="text-2xl text-text-primary"
                            name="upload-cloud"
                          />
                          <div className="mt-1 mb-2 text-xs text-center text-text-primary">
                            or
                          </div>
                          <Button className="whitespace-nowrap">
                            <div className="text-xs">Choose an image.</div>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default Thumbnail;
