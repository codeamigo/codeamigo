import Image from 'next/image';
import { useEffect } from 'react';

import * as hal from '../assets/hal.png';

const Home = () => {
  // watch for keydown of the 'a' key
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      console.log(event.key);
      if (event.key === 'a') {
        // open a new window
        window.open('https://forms.gle/PtW2z4ehfhikHooy5', '_blank');
      } else if (event.key === 'd') {
        window.open('/v2', '_blank');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-between sm:shrink-0">
      <div className="w-full max-w-3xl">
        <span className=" inline-flex h-6 cursor-default select-none items-center whitespace-nowrap rounded bg-[#330000] px-2 text-xs font-semibold text-red-500">
          Currently in beta
        </span>
        <h1 className=" mt-2 bg-gradient-to-br from-white to-neutral-600 bg-clip-text text-[35px] font-bold leading-[42px] tracking-[-0.64px] text-transparent sm:text-6xl sm:leading-[68px] sm:tracking-[-0.896px]">
          <span className="inline-block max-w-[525px] align-top">
            Learn to Code
            <br />
            Like a Developer
          </span>
        </h1>
        <p className=" mt-4 mb-8 text-base font-normal text-neutral-600">
          <span className="inline-block max-w-[591px] align-top">
            Today's developers didn’t learn C before learning JavaScript or
            Python, why should you learn how to code without the latest
            advancements in technology? Learn to code with the assistance of AI.
          </span>
        </p>
        <button
          className=" group hidden select-none items-center gap-2 text-sm font-semibold text-neutral-600 outline-none transition duration-200 ease-in-out hover:text-neutral-600 focus:text-neutral-600 sm:inline-flex"
          onClick={() => {
            window.open('https://forms.gle/PtW2z4ehfhikHooy5', '_blank');
          }}
        >
          Press{' '}
          <kbd className="group-hover:neutral-700 group-focus:neutral-700 inline-flex h-[22px] w-[22px] select-none items-center justify-center rounded bg-neutral-400 text-sm uppercase text-black transition duration-200 ease-in-out group-focus:text-black">
            A
          </kbd>{' '}
          to request access
        </button>
        <button
          className=" group hidden select-none items-center gap-2 text-sm font-semibold text-neutral-600 outline-none transition duration-200 ease-in-out hover:text-neutral-600 focus:text-neutral-600 sm:inline-flex"
          onClick={() => {
            window.open('/v2', '_blank');
          }}
        >
          or{' '}
          <kbd className="group-hover:neutral-700 group-focus:neutral-700 inline-flex h-[22px] w-[22px] select-none items-center justify-center rounded bg-neutral-400 text-sm uppercase text-black transition duration-200 ease-in-out group-focus:text-black">
            D
          </kbd>{' '}
          to demo.
        </button>
        <button
          className=" inline-flex h-10 cursor-pointer select-none items-center justify-center gap-1 rounded-md border bg-white px-4 text-sm font-semibold text-black transition duration-200 ease-in-out hover:bg-white/90 focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-white sm:hidden"
          //   style="box-shadow: rgba(5, 162, 194, 0.3) -8px 0px 20px, rgba(112, 225, 200, 0.3) 0px 0px 20px, rgba(255, 178, 36, 0.3) 8px 0px 20px;"
        >
          Request access
        </button>
      </div>
      <div className="hidden w-full animate-pulse items-center justify-center sm:flex">
        <Image height={120} src={hal} width={120} />
      </div>
    </div>
  );
};

export default Home;
