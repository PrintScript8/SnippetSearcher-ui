import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import axios from "axios";
import {Rule} from "../types/Rule.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {TestCaseResult} from "./queries.tsx";


export class OperationHandler implements SnippetOperations {
    private readonly getAccessToken: () => Promise<string>;

    constructor(getAccessToken: () => Promise<string>) {
        this.getAccessToken = getAccessToken;
    }

    private async getAuthHeaders() {
        const token = await this.getAccessToken();
        return {
            Authorization: `${token}`,
            id: 1
        };
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const headers = await this.getAuthHeaders();
        return axios.post("https://snippet-searcher.duckdns.org/snippets/snippets", createSnippet, {headers : headers}) //8082 es snippet
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get(`https://snippet-searcher.duckdns.org/snippets/snippets/${id}`, { headers: headers }); //8082 es snippet
        return response.data;
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const headers = await this.getAuthHeaders();
        console.log(updateSnippet)
        const response = await axios.put(
            `https://snippet-searcher.duckdns.org/snippets/snippets/${id}`,
            { content: updateSnippet.content },
            {
                params: { language: "printscript" },
                headers: headers
            }
        );
        return response.data;
    }

    async deleteSnippet(id: string): Promise<string> {
        const headers = await this.getAuthHeaders();
        return axios.delete(`https://snippet-searcher.duckdns.org/snippets/snippets/${id}`, {
            headers: headers
        }) //8082 es snippet
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const headers = await this.getAuthHeaders();
        return axios.put("https://snippet-searcher.duckdns.org/snippets/snippets/config/formatting", newRules, {
            params: {language: "printscript"},
            headers: headers
        }) //8082 es snippet
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const headers = await this.getAuthHeaders();
        return axios.put("https://snippet-searcher.duckdns.org/snippets/snippets/config/linting", newRules, {
            params: {language: "printscript"},
            headers: headers
        }) //8082 es snippet
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get(`https://snippet-searcher.duckdns.org/snippets/snippets/paginated`, {
            params: { page, pageSize, snippetName },
            headers: headers
        });

        const data = response.data; // Access the response data directly

        if (!data || !data.snippets) {
            throw new Error("Snippets data is undefined or in an unexpected format.");
        }

        return {
            page: data.page,
            page_size: data.pageSize,
            count: data.count,
            snippets: data.snippets.map((snippet: any) => ({
                id: snippet.id,
                name: snippet.name,
                language: snippet.language,
                extension: snippet.extension,
                content: snippet.content,
                compliance: snippet.status,
                author: snippet.nickName
            }))
        };
    }

    async getUserFriends(name?: string, page: number = 0, pageSize: number = 10): Promise<PaginatedUsers> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get(`https://snippet-searcher.duckdns.org/permissions/users/all`, {
            params: { name, page: page - 1, pageSize },
            headers: headers
        });
        return response.data;
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const headers = await this.getAuthHeaders();
        return axios.put(`https://snippet-searcher.duckdns.org/permissions/users/snippets/share`, {
            snippetId: snippetId,
            id: userId
        }, {
            headers: headers
        }) //8083 es permissions
    }

    async getFormatRules(): Promise<Rule[]> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get("https://snippet-searcher.duckdns.org/snippets/snippets/config/formatting", {
            params: { language: "printscript" },
            headers: headers
        }); //8082 es snippet
        return response.data;
    }

    async getLintingRules(): Promise<Rule[]> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get("https://snippet-searcher.duckdns.org/snippets/snippets/config/linting", {
            params: {language: "printscript"},
            headers: headers
        }); //8082 es snippet
        console.log(response.data)
        return response.data;
    }

    async getTestCases(): Promise<TestCase[]> {
        const headers = await this.getAuthHeaders();
        const response = await axios.get("https://snippet-searcher.duckdns.org/snippets/test", {
            headers: headers
        });

        if (Array.isArray(response.data)) {
            // Map the response data to match the expected TestCase structure
            return response.data.map((item: any) => ({
                id: item.testId.toString(), // Convert testId to string and assign it to id
                name: item.name,
                input: item.input || [],
                output: item.output || []
            }));
        } else {
            return [];
        }
    }

    async formatSnippet(snippet: string, id: string): Promise<string> {
        const headers = await this.getAuthHeaders();
        const response = await axios.put("https://snippet-searcher.duckdns.org/snippets/actions/format", {
                code: snippet,
                language: "printscript",
                id: id
            }, {
            headers: headers
        }); //8082 es snippet
        console.log(response.data)
        return response.data;
    }

    async getFileTypes(): Promise<FileType[]> {
        const headers = await this.getAuthHeaders();
        console.log("getFileTypes")
        const response = await axios.get("https://snippet-searcher.duckdns.org/snippets/actions/type", {
            headers: headers
        });
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error("Response is not an array");
        }
    }
    async postTestCase(testCase: Partial<TestCase>, id: string): Promise<TestCase> {
        const headers = await this.getAuthHeaders();
        console.log(id, testCase);
        return axios.post("https://snippet-searcher.duckdns.org/snippets/test", {
            id: id,
            name: testCase.name,
            input: testCase.input || [],
            output: testCase.output || []
        }, {
            headers: headers
        });
    }

    async removeTestCase(id: string): Promise<string> {
        const headers = await this.getAuthHeaders();
        return axios.delete(`https://snippet-searcher.duckdns.org/snippets/test/${id}`, {
            headers: headers
        }) //8082 es snippet
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        const headers = await this.getAuthHeaders();
        console.log(testCase.id)
        const response = await axios.put("https://snippet-searcher.duckdns.org/snippets/test/execute", {
                id: testCase.id,
                name: testCase.name,
                input: testCase.input || [],
                output: testCase.output || [],
            }, {
            headers: headers
        }); //8082 es snippet
        return response.data as TestCaseResult;
    }

}