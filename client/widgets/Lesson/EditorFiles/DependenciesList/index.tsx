import React, { useEffect, useRef, useState } from "react";

import Icon from "@components/Icon";

import styles from "./DependenciesList.module.scss";
import { AlgoliaSearchResultType } from "..";
import {
  RegularDependencyFragment,
  useCreateDependencyMutation,
  useDeleteDependencyMutation,
} from "../../../../generated/graphql";

const DependenciesList: React.FC<Props> = ({ name, dependencies, stepId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<AlgoliaSearchResultType>
  >([]);

  const [createDependencyM] = useCreateDependencyMutation();
  const [deleteDependency] = useDeleteDependencyMutation();

  const searchDeps = async (query: string) => {
    const url = `https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=00383ecd8441ead30b1b0ff981c426f5`;

    const response: {
      hits: Array<AlgoliaSearchResultType>;
    } = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        hitsPerPage: 4,
      }),
    }).then((res) => res.json());

    setSearchResults(response.hits);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setIsAdding(false);
      setSearchResults([]);
    }, 500);
  };

  const createDependency = async (result: AlgoliaSearchResultType) => {
    console.log(result);
    await createDependencyM({
      variables: {
        stepId,
        package: result.name,
        version: result.version,
      },
      refetchQueries: ["Step"],
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
        <Icon
          name="plus-circled"
          className="text-sm text-gray-500 hover:text-black cursor-pointer"
          onClick={() => setIsAdding(true)}
        />
      </div>
      <div>
        {dependencies &&
          dependencies
            .slice()
            .sort((a, b) => a.package.localeCompare(b.package))
            .map((dep) => (
              <div
                key={dep.id}
                className={`flex justify-between w-full px-1 py-1 hover:bg-gray-100 ${styles.FILE}`}
              >
                <div className="text-xs">
                  {dep.package} {dep.version}
                </div>
                <Icon
                  name="minus-circled"
                  className="text-red-600 text-sm hidden cursor-pointer"
                  onClick={() =>
                    deleteDependency({
                      variables: { id: dep.id },
                      refetchQueries: ["Step"],
                    })
                  }
                />
              </div>
            ))}
        <div className="relative">
          {isAdding && (
            <div className="px-1 py-1">
              <input
                type="text"
                className="w-full text-xs px-2 py-1"
                onBlur={handleBlur}
                onChange={(e) => searchDeps(e.currentTarget.value)}
                ref={inputRef}
              />
            </div>
          )}
          {searchResults && searchResults.length > 0 && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {searchResults.map((result) => {
                  return (
                    <div
                      className="px-2 py-2 text-xs hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      role="menuitem"
                      onClick={() => createDependency(result)}
                      key={result.name}
                    >
                      {result.name} {result.version}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type Props = {
  name: string;
  dependencies?: RegularDependencyFragment[] | null;
  stepId: number;
};

export default DependenciesList;
