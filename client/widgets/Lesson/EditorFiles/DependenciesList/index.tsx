import { Listbox, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import {
  RegularDependencyFragment,
  useCreateDependencyMutation,
  useDeleteDependencyMutation,
} from '👨‍💻generated/graphql';

import { AlgoliaSearchResultType } from '..';
import styles from './DependenciesList.module.scss';

const DependenciesList: React.FC<Props> = ({
  dependencies,
  isEditing,
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

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

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
      // do nothing
      return;
    }

    setIsAdding(false);
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (optionsRef.current) {
        if (optionsRef.current.firstChild) {
          // @ts-ignore
          optionsRef.current.firstChild.focus();
        } else {
          optionsRef.current.focus();
        }
      }
    }

    // Does not work
    // if (e.key === 'ArrowUp') {
    //   if (!inputRef.current) return;
    //   if (!optionsRef.current) return;
    //   if (!optionsRef.current.firstChild) return;
    //   // @ts-ignore
    //   if (e.target.id === optionsRef.current?.firstChild.id) {
    //     // @ts-ignore
    //     optionsRef.current.lastChild.focus();
    //     console.log(optionsRef.current.lastChild);
    //   }
    // }
  };

  const createDependency = async (result: AlgoliaSearchResultType) => {
    await createDependencyM({
      refetchQueries: ['Step'],
      variables: {
        package: result.name,
        stepId,
        version: result.tags.next || result.tags.latest,
      },
    });

    setIsAdding(false);
    setSearchResults([]);
  };

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-bg-nav-offset p-1 flex justify-between content-center">
        <span className="text-sm text-text-primary font-semibold">{name}</span>
        {isEditing && (
          <Icon
            className="text-sm text-text-primary hover:text-accent cursor-pointer"
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
                className={`flex justify-between w-full px-1 py-1 text-text-primary hover:bg-bg-nav ${
                  dep.package !== 'codeamigo-jest-lite' ? styles.FILE : ''
                }`}
                key={dep.id}
              >
                <div className="text-xs">
                  {dep.package} {dep.version}
                </div>
                {isEditing && (
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
            <div className="p-1">
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
            <Listbox
              onBlur={handleBlur}
              /* @ts-ignore */
              onChange={createDependency}
              onKeyDown={handleKeyDown}
              value=""
            >
              <div className="relative p-1">
                <Transition
                  className="w-full rounded-md shadow-md"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  show={searchResults.length > 0}
                >
                  <Listbox.Options
                    className="outline-none"
                    /* @ts-ignore */
                    ref={optionsRef}
                    static={isAdding}
                  >
                    {searchResults.map((result, i) => (
                      <Listbox.Option
                        className="outline-none"
                        key={i}
                        // @ts-ignore
                        value={result}
                      >
                        {({ active }) => {
                          return (
                            <div
                              className={`${
                                active
                                  ? 'text-primary bg-accent'
                                  : 'text-gray-900'
                              } cursor-pointer select-none relative py-1 px-2`}
                            >
                              <span
                                className={`${
                                  active ? 'text-primary' : 'text-accent'
                                } text-xs flex items-center`}
                              >
                                {result.name}{' '}
                                {result.tags.next || result.tags.latest}
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
          )}
        </div>
      </div>
    </>
  );
};

type Props = {
  dependencies?: RegularDependencyFragment[] | null;
  isEditing?: boolean;
  name: string;
  stepId: number;
};

export default DependenciesList;
