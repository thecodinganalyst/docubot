import GithubApi from "../../lib/github";
const github_api_token = Cypress.env('GITHUB_API_PERSONAL_ACCESS_TOKEN');
const github_repo = Cypress.env('GITHUB_REPO');

describe("github api filterObj", () => {
    let githubApi;

    beforeEach(() => {
        githubApi = new GithubApi(github_api_token);
    })

    it("should filter object correctly", () => {
        const obj1 = {a: 1, b: 2, c: 3};
        const test = githubApi.filterObj(obj1, ["a", "b"]);
        expect(test).to.deep.equal({a: 1, b: 2});
    })

    it("should return empty", () => {
        const obj1 = {a: 1, b: 2, c: 3};
        const test = githubApi.filterObj(obj1, ["d", "e"]);
        expect(test).to.deep.equal({});
    })
})

describe("github api formCompleteUrl", () => {
    let githubApi;

    beforeEach(() => {
        githubApi = new GithubApi(github_api_token);
    })

    it("should return same url", async () => {
        const test = await githubApi.formCompleteUrl(github_repo);
        const fullUrl = "https://api.github.com/repos" + github_repo;
        expect(test).to.equal(fullUrl);
    })
})

describe("github api getContentDirectories", () => {
    let githubApi, content, directories;

    beforeEach(() => {
        githubApi = new GithubApi(github_api_token);
        cy.fixture("content").then((result) => {
            content = result;
        })
        cy.fixture("directories").then((result) => {
            directories = result;
        })
    })

    it("should filter directories from github", async () => {
        cy.stub(githubApi, "getContent").returns(content);
        const test = await githubApi.getContentDirectories(github_repo, ['name', 'html_url']);
        expect(test).to.deep.equal(directories);
    })
})

describe("github api getMarkdownFilesInDirectory", () => {
    let githubApi, getting_started, markdown_files;

    beforeEach(() => {
        githubApi = new GithubApi(github_api_token);
        cy.fixture("getting_started").then((result) => {
            getting_started = result;
        })
        cy.fixture("markdown_files").then((result) => {
            markdown_files = result;
        })
    })

    it("should return only markdown files", async () => {
        const getting_started_url = "https://api.github.com/repos/thecodinganalyst/hellokotlin/contents/01_Getting_Started?ref=main";
        cy.stub(githubApi, "getContent").returns(getting_started);
        const test = await githubApi.getMarkdownFilesInDirectory(getting_started_url, ['name', 'url'])
        expect(test).to.deep.equal(markdown_files);
    })
})

describe("github integration test", () => {
    let githubApi;

    beforeEach(() => {
        githubApi = new GithubApi(github_api_token);
    })

    it("should return results with the required properties", async () => {
        const test = await githubApi.getContentDirectories(github_repo, ['name', 'html_url']);
        expect(test).to.be.instanceof(Array);
        expect(test[0]).to.haveOwnProperty('name');
        expect(test[0]).to.haveOwnProperty('html_url');
    })

    it("should have the same result", async() => {
        const test = await githubApi.getContent(github_repo, ['name']);
        const fullUrl = "https://api.github.com/repos" + github_repo;
        const test2 = await githubApi.getContent(fullUrl, ['name']);
        expect(test.url).to.equal(test2.url);
    })

    it("should get markdown files", async() => {
        const prerequisite = await githubApi.getContentDirectories(github_repo, ['name', 'url']);
        const item1 = prerequisite[0];
        const test = await githubApi.getMarkdownFilesInDirectory(item1.url, ['name', 'download_url']);
        expect(test).to.be.instanceof(Array);
        expect(test[0]).to.haveOwnProperty('name');
        expect(test[0]).to.haveOwnProperty('download_url');
    })
})