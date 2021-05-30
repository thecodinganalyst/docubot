import GithubApi from "./github";

const github_api_token = process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN;
const github_repo = process.env.GITHUB_REPO;

export function getContent(category, item){
    return "This is " + item + " in " + category;
}

export function convertCategoryListToPaths(catList: category[]){
    return catList.flatMap(dir => {
        return dir.items.map(item => {
            return {
                params: {
                    category: dir.display.replaceAll(' ', '_'),
                    item: item.display.replaceAll(' ', '_'),
                }
            }
        })
    })
}

export async function getPaths(){
    return convertCategoryListToPaths(await getNavigation());
}

export async function getNavigationFromGithub(githubApi, githubRepo): Promise<category[]>{
    const dirs = await githubApi.getContentDirectories(githubRepo, ['name', 'url']);
    for(let i=0; i < dirs.length; i++){
        let links = await githubApi.getMarkdownFilesInDirectory(dirs[i].url, ['name', 'download_url']);
        links = links
            .map(link => transformObj(link, ['name', 'download_url'], ['display', 'link']))
            .map(link => {
                link.display = processDisplay(link.display);
                return link;
            });
        dirs[i] = transformObj(dirs[i], ['name'], ['display']);
        dirs[i].display = processDisplay(dirs[i].display);
        dirs[i].items = links.map(link => {
            link.link = processLink(dirs[i].display, link.display);
            return link;
        })
    }
    return dirs;
}

export function processLink(category: string, item: string){
    return '/' + category.replaceAll(' ', '_') + '/' + item.replaceAll(' ', '_');
}

export function processDisplay(text: string){
    let param = text.includes('.') ? text.substr(0, text.indexOf('.')) : text;
    let result = param.split('_');
    return parseInt(result[0]) ? result.slice(1).join(' ') : result.join(' ');
}

export function transformObj(obj: any, originalFields: string[], newFields: string[]): any{
    return Object.keys(obj).reduce((res, curr, i) => {
        if(originalFields.includes(curr)){
            res[newFields[i]] = obj[curr];
        }
        return res;
    }, {})
}

export async function getNavigation(): Promise<category[]>{
    const githubApi = new GithubApi(github_api_token);
    return getNavigationFromGithub(githubApi, github_repo);
}

export interface item{
    display: string
    link: string
}

export interface category{
    display: string
    items?: item[]
}