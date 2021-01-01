import Icon from '@components/Icon';
import {
  RegularDependencyFragment,
  useCreateDependencyMutation,
  useDeleteDependencyMutation,
} from '@generated/graphql';
import { Listbox, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';

import { AlgoliaSearchResultType } from '..';
import styles from './DependenciesList.module.scss';

const DependenciesList: React.FC<Props> = ({
  dependencies,
  isEditting,
  name,
  stepId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<AlgoliaSearchResultType>
  >([]);

  const [createDependencyM] = useCreateDependencyMutation();
  const [deleteDependency] = useDeleteDependencyMutation();

  const searchDeps = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = `https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=00383ecd8441ead30b1b0ff981c426f5`;

    const response: {
      hits: Array<AlgoliaSearchResultType>;
    } = await fetch(url, {
      body: JSON.stringify({
        hitsPerPage: 4,
        query: e.currentTarget.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((res) => res.json());

    setSearchResults(response.hits);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.relatedTarget &&
      (optionsRef.current === e.relatedTarget ||
        // @ts-ignore
        e.relatedTarget.parentElement === optionsRef.current)
    ) {
      console.log(e);
      // do nothing
      return;
    }

    setIsAdding(false);
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (optionsRef.current) optionsRef.current.focus();
    }
  };

  const createDependency = async (result: AlgoliaSearchResultType) => {
    await createDependencyM({
      refetchQueries: ['Step'],
      variables: {
        package: result.name,
        stepId,
        version: result.version,
      },
    });

    setIsAdding(false);
    setSearchResults([]);
  };

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-gray-200 p-1 flex justify-between content-center">
        <span className="text-sm font-semibold">{name}</span>
        {isEditting && (
          <Icon
            className="text-sm text-gray-500 hover:text-black cursor-pointer"
            name="plus-circled"
            onClick={() => setIsAdding(true)}
          />
        )}
      </div>
      <div>
        {dependencies &&
          dependencies
            .slice()
            .sort((a, b) => a.package.localeCompare(b.package))
            .map((dep) => (
              <div
                className={`flex justify-between w-full px-1 py-1 hover:bg-gray-100 ${
                  dep.package !== 'codeamigo-jest-lite' ? styles.FILE : ''
                }`}
                key={dep.id}
              >
                <div className="text-xs">
                  {dep.package} {dep.version}
                </div>
                {isEditting && (
                  <Icon
                    className="text-red-600 text-sm hidden cursor-pointer"
                    name="minus-circled"
                    onClick={() => {
                      const yes = window.confirm(
                        'Are you sure you want to delete this dependency?'
                      );

                      if (yes) {
                        deleteDependency({
                          refetchQueries: ['Step'],
                          variables: { id: dep.id },
                        });
                      }
                    }}
                  />
                )}
              </div>
            ))}
        <div className="relative">
          {isAdding && (
            <div className="px-1 py-1">
              <input
                className="w-full text-xs px-2 py-1"
                onBlur={handleBlur}
                onChange={searchDeps}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                type="text"
              />
            </div>
          )}
          {searchResults && searchResults.length > 0 && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              {/* @ts-ignore */}
              <Listbox onBlur={handleBlur} onChange={createDependency} value="">
                <div className="relative">
                  <Transition
                    className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    show={searchResults.length > 0}
                  >
                    {/* @ts-ignore */}
                    <Listbox.Options ref={optionsRef} static={isAdding}>
                      {searchResults.map((result, i) => (
                        // @ts-ignore
                        <Listbox.Option key={result.name + i} value={result}>
                          {({ active }) => {
                            return (
                              <div
                                className={`${
                                  active
                                    ? 'text-white bg-blue-600'
                                    : 'text-gray-900'
                                } cursor-default select-none relative py-2 pl-8 pr-4`}
                              >
                                <span
                                  className={`${
                                    active ? 'text-white' : 'text-blue-600'
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  {result.name} {result.version}
                                </span>
                              </div>
                            );
                          }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              {/* <div
                aria-labelledby="options-menu"
                aria-orientation="vertical"
                className="py-1"
                role="menu"
              >
                {searchResults.map((result) => {
                  return (
                    <div
                      className="px-2 py-2 text-xs hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      key={result.name}
                      onClick={() => createDependency(result)}
                      role="menuitem"
                    >
                      {result.name} {result.version}
                    </div>
                  );
                })}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type Props = {
  dependencies?: RegularDependencyFragment[] | null;
  isEditting?: boolean;
  name: string;
  stepId: number;
};

export default DependenciesList;
