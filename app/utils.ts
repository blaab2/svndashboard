import { cache } from 'react'
import simpleGit from "simple-git";

export const getGitLog = cache(async (id: string) => {
    const git = simpleGit('C:\\Users\\danie\\PhpstormProjects\\tbcoptersportal_backend');
    const log = await git.log({ '--max-count': 5 });
    return log;
})