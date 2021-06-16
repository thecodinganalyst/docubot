import {
    Content,
    convertCategoryListToPaths,
    processDisplay,
    processLink,
    transformObj
} from "../../lib/content";
import GithubApi from "../../lib/github";

const github_api_token = Cypress.env('GH_API_PERSONAL_ACCESS_TOKEN');
const github_repo = Cypress.env('GH_REPO');

describe('getNavigationFromGithub', () => {
    it("should return correct results", async () => {
        const content = Content.getInstance(github_api_token, github_repo);
        const navigation = await content.getNavigation();
        expect(navigation).to.be.instanceof(Array);
        const result = navigation[0];
        expect(Object.keys(result)).to.deep.equal(['display', 'items']);
        expect(Object.keys(result.items[0])).to.deep.equal(['display', 'link']);
    })
})

describe('getContentFromGithub', () => {
    it("should return correct results", async () => {
        const content = Content.getInstance(github_api_token, github_repo);
        const navigation = await content.getContentFromGithub();
        expect(navigation).to.be.instanceof(Array);
        const result = navigation[0];
        expect(Object.keys(result)).to.deep.equal(['display', 'items']);
        expect(Object.keys(result.items[0])).to.deep.equal(['display', 'content_path', 'content', 'link']);
        expect(typeof result.items[0].content).to.equal('string');
    })
})

describe('processLink', () => {
    it('should generate link without spaces', () => {
        const test = processLink('hello world 1', 'foo bar 2');
        expect(test).to.not.contain(' ');
    })
})

describe('processDisplay', () => {
    it('should remove first item', () => {
        const test = processDisplay('01_hello_world');
        expect(test).to.equal('hello world');
    })

    it('should not remove the first item', () => {
        const test = processDisplay('hello_world');
        expect(test).to.equal('hello world');
    })

    it('should remove the extension', () => {
        const test = processDisplay('01_hello_world.md');
        expect(test).to.equal('hello world');
    })
})

describe('convertCategoryListToPaths', () => {
    it('should return list of params', () => {
        cy.fixture('category_list').then((catList) => {
            const test = convertCategoryListToPaths(catList);
            expect(test.length).to.be.greaterThan(0);
            expect(test[0]).to.haveOwnProperty('params');
            expect(test[0].params).to.haveOwnProperty('item');
            expect(test[0].params).to.haveOwnProperty('category');
        })
    })
})

describe('transformObj', () => {
    it('should rename all keys in the object', () => {
        const obj = {a: 1, b: 2, c: 3}
        const res = transformObj(obj, ['a', 'b', 'c'], ['d', 'e', 'f']);
        expect(Object.keys(res)).to.deep.equal(['d', 'e', 'f']);
    })

    it('should remove fields not in the list', () => {
        const obj = {a: 1, b: 2, c: 3}
        const res = transformObj(obj, ['a', 'b'], ['d', 'e']);
        expect(Object.keys(res)).to.deep.equal(['d', 'e']);
    })

    it('should return empty object', () => {
        const obj = {a: 1, b: 2, c: 3}
        const res = transformObj(obj, ['d', 'e'], ['f', 'g']);
        expect(Object.keys(res)).to.deep.equal([]);
    })

    it('should return correctly even when the keys are not aligned', () => {
        const original = {a: 1, b: 2, c: 3, d: 4}
        const expected = {a: 1, c: 3}
        const test = transformObj(original, ['a', 'c'], ['a', 'c']);
        expect(test).to.deep.equal(expected);
    })
})