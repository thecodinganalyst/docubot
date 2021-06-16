import GithubApi from "./github";
import * as kramed from "kramed";

export class Content{
    static instance: Content;
    private data: category[];
    private githubApi: GithubApi;
    private readonly githubRepo: string;
    readonly default_main_file_name = 'index.md'

    private constructor(github_api_token, github_repo) {
        this.githubApi = new GithubApi(github_api_token);
        this.githubRepo = github_repo;
    }
    static getInstance(github_api_token, github_repo){
        return Content.instance?? new Content(github_api_token, github_repo);
    }
    getTitle(){
        return this.githubRepo.split('/').pop().replace("-", " ");
    }
    async getNavigation(): Promise<category[]>{
        if(!this.data) this.data = await this.getContentFromGithub();
        let navigation = JSON.parse(JSON.stringify(this.data));
        for(let i=0; i<navigation?.length; i++){
            for(let j=0; j<navigation[i].items.length; j++){
                navigation[i].items[j] = transformObj(navigation[i].items[j], ['display', 'link'], ['display', 'link']);
            }
        }
        return Promise.resolve(navigation);
    }
    async getPaths(){
        return convertCategoryListToPaths(await this.getNavigation());
    }
    async getIndexPageContent(){
        const mainFiles = await this.githubApi.getMarkdownFilesInDirectory(this.githubRepo + '/contents', ['name', 'download_url']);
        const mainFile = mainFiles.find(file => file.download_url.split('/').pop() == this.default_main_file_name)
        if(!mainFile) return "";
        const text = await (await fetch(mainFile.download_url)).text();
        return kramed(text);
    }
    async getContentData(category: string, item: string): Promise<string>{
        if(!this.data) this.data = await this.getContentFromGithub();
        for(let i=0; i<this.data.length; i++){
            for(let j=0; j<this.data[i].items.length; j++){
                const cat = replaceSpaceWithUnderscore(this.data[i].display);
                const ite = replaceSpaceWithUnderscore(this.data[i].items[j].display);
                if(cat == category && ite == item){
                    return Promise.resolve(this.data[i].items[j].content);
                }
            }
        }
        return null;
    }

    async getContentFromGithub(): Promise<category[]>{
        const dirs = await this.githubApi.getContentDirectories(this.githubRepo, ['name', 'url']);
        for(let i=0; i < dirs?.length; i++){
            let links = await this.githubApi.getMarkdownFilesInDirectory(dirs[i].url, ['name', 'download_url']);
            links = links
                .map(link => transformObj(link, ['name', 'download_url'], ['display', 'content_path']))
                .map(link => {
                    link.display = processDisplay(link.display);
                    return link;
                });
            dirs[i] = transformObj(dirs[i], ['name'], ['display']);
            dirs[i].display = processDisplay(dirs[i].display);
            dirs[i].items = await Promise.all(
                links.map(async link => {
                    const text = await (await fetch(link.content_path)).text();
                    link.content = kramed(text);
                    link.link = processLink(dirs[i].display, link.display);
                    return link;
                })
            );
        }
        return dirs;
    }
}

export function convertCategoryListToPaths(catList: category[]){
    return catList.flatMap(dir => {
        return dir.items.map(item => {
            return {
                params: {
                    category: replaceSpaceWithUnderscore(dir.display),
                    item: replaceSpaceWithUnderscore(item.display),
                }
            }
        })
    })
}

export function replaceSpaceWithUnderscore(text: string){
    return text.replaceAll(/ /g, '_');
}

export function processLink(...items: string[]){
    return items.reduce((res, cur, i) => {
        return res.concat('/').concat(replaceSpaceWithUnderscore(items[i]));
    }, "");
}

export function processDisplay(text: string){
    let param = text.includes('.') ? text.substr(0, text.indexOf('.')) : text;
    let result = param.split('_');
    return parseInt(result[0]) ? result.slice(1).join(' ') : result.join(' ');
}

export function transformObj(obj: any, originalFields: string[], newFields: string[]): any{
    return originalFields.reduce((res, curr, i) => {
        if(Object.keys(obj).includes(curr)){
            res[newFields[i]] = obj[originalFields[i]];
        }
        return res;
    }, {})
}

export interface item{
    display: string
    link: string
    content_path: string
    content: string
}

export interface category{
    display: string
    items?: item[]
}