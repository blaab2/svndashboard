import simpleGit from "simple-git";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
    const git = simpleGit('C:\\Users\\danie\\PhpstormProjects\\tbcoptersportal_backend');
    const log = await git.log({ '--max-count': 10 });
    return Response.json({ log })
}