import {Octokit} from "@octokit/core";

const github_api_url = 'https://api.github.com/repos';

export default class GithubApi {
    octokit: Octokit;

    constructor(github_api_token) {
        this.octokit = new Octokit({
            auth: github_api_token,
        });
    }

    formCompleteUrl(url): string{
        return url.startsWith(github_api_url)? url : github_api_url + url;
    }

    async getContent(url): Promise<any>{
        let request_url = this.formCompleteUrl(url);
        return await this.octokit.request(request_url).then(
            res => res.status == 200 ? res.data : null,
            err => null
        );
    }

    async getContentDirectories(repo, fields): Promise<any[]>{
        const data = await this.getContent(repo + '/contents');
        if(!data) return null;
        return data
            .filter(item => item.type == 'dir')
            .map(item => this.filterObj(item, fields))
    }

    async getMarkdownFilesInDirectory(dir, fields): Promise<any>{
        const data = await this.getContent(dir);
        if(!data) return null;
        return data
            .filter(item => item.type == 'file' && item.name.endsWith(".md"))
            .map(item => this.filterObj(item, fields))
    }

    filterObj(obj: any, props: string[]): any{
        return Object.keys(obj)
            .filter(key => props.includes(key))
            .reduce((result, key) => {
                result[key] = obj[key];
                return result;
            }, {});
    }
}
