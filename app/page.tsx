"use client";
import {useRef, useState, useEffect} from "react";
import useSWR from "swr";
// `app` directory
import {Fireworks} from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import moment from 'moment';


const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const revalidateTime_ms = 15000; // revalidate the data at most every 10 seconds

function getGitLog() {
    const {data, error, isValidating} = useSWR("/api", fetcher, {
        refreshInterval: revalidateTime_ms,
    });

    return {
        data: data,
        error: error,
    };
}

function compareObjs(obj1,obj2){
    return JSON.stringify(obj1)===JSON.stringify(obj2);
}

export default function Page() {
    const ref = useRef<FireworksHandlers>(null);

    // State variable and setter for fireworks
    const [fireworks, setFireworks] = useState(0);

    const {data, error} = getGitLog();


    useEffect(() => {
        // Your function to be triggered when yourData changes
        console.log('Your data has changed:', data);
        setFireworks(1);


        // You can perform any side effects or actions here
        // Set up a timeout to execute the function after 10 seconds
        const timeoutId = setTimeout(() => {
            // Your function to be executed after 10 seconds
            console.log('Function executed after 10 seconds');
            //ref.current.stop();
            setFireworks(0);
        }, revalidateTime_ms);

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);

        // Cleanup function (optional): It runs before the next effect or when the component unmounts
        return () => {
            // Perform cleanup if necessary

        };
    }, [data]); // Pass yourData as a dependency




    if (error)
        return <div className="p-2 m-2">Failed to load : {error.message}</div>;
    if (!data) return <div className="p-2 m-2">Loading...</div>


    const options: FireworksOptions = {
        speed: 3,
        explosion: 9,
		intensity: 50,
        particles: 120,
        mouse: {
            max: 1,
            move: false,
            click: true
        }
    };
    const style: CSSProperties = {
        position: "fixed",
        width: "100%",
        height: "100%"
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            <div className={`absolute flex items-center justify-center h-auto w-full transition-all duration-1000 ${fireworks === 1 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-center p-30 bg-black/75 text-white w-full font-mono text-4xl">Juhuuu, there are new commits</p>
            </div>

            {fireworks === 1 && (
              <Fireworks
                    ref={ref}
                    options={options}
                    style={style}
                />
            )}

            <div className="z-0 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    SVN Commit Stream
                </p>
            </div>

            <div className=" max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Author
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Body
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Message
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>

                    </tr>
                    </thead>
                    <tbody>

                    {

                        data.log.all.map((project) => (
                            <tr key={project.hash} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th>{project.author_name}</th>
                                <th>{project.body}</th>
                                <th>{project.message}</th>
                                <th>{moment(project.date).format('LLL')}</th>
                            </tr>
                        ))}


                    </tbody>
                </table>
            </div>
            <div className="z-10 max-w-5xl w-full items-center justify-end font-mono text-sm lg:flex">

                <div
                    className="fixed bottom-0 right-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://www.google.de"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        DTADAS

                    </a>
                </div>
            </div>



        </main>


    );
}
