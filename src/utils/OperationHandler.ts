import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import axios from "axios";
import {Rule} from "../types/Rule.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {TestCaseResult} from "./queries.tsx";


export class OperationHandler implements SnippetOperations {

    createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        return axios.post("http://localhost:8082/snippets", createSnippet, {
            headers: {
                id: 1
            }
        }) //8082 es snippet
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const response = await axios.get(`http://localhost:8082/snippets/${id}`, {
            headers: {
                id: 1
            }
        }); //8082 es snippet
        return response.data;
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        console.log(updateSnippet)
        const response = await axios.put(
            `http://localhost:8082/snippets/${id}`,
            { content: updateSnippet.content },
            {
                params: { language: "printscript" },
                headers: { id: 1 }
            }
        );
        return response.data;
    }

    deleteSnippet(id: string): Promise<string> {
        return axios.delete(`http://localhost:8082/snippets/${id}`, {
            headers: {
                id: 1
            }
        }) //8082 es snippet
    }

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        return axios.put("http://localhost:8082/snippets/config/formatting", newRules, {
            params: {language: "printscript"},
            headers: {
                id: 1
            }
        }) //8082 es snippet
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        return axios.put("http://localhost:8082/snippets/config/linting", newRules, {
            params: {language: "printscript"},
            headers: {
                id: 1
            }
        }) //8082 es snippet
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        const response = await axios.get(`http://localhost:8082/snippets/paginated`, {
            params: { page, pageSize, snippetName },
            headers: { id: 1 }
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
                author: snippet.ownerId.toString()
            }))
        };
    }

    async getUserFriends(name?: string, page: number = 0, pageSize: number = 10): Promise<PaginatedUsers> {
        const response = await axios.get(`http://localhost:8083/users`, {
            params: { name, page: page - 1, pageSize },
            headers: { id: 1 }
        });
        return response.data;
    }

    shareSnippet(snippetId: string,userId: string): Promise<Snippet> {
        return axios.put(`http://localhost:8083/users/snippets/share`, {
              snippetId: snippetId,
              id: userId
            }, {
            headers: {
                id: 1
            }
        }) //8083 es permissions
    }

    async getFormatRules(): Promise<Rule[]> {
        const response = await axios.get("http://localhost:8082/snippets/config/formatting", {
            params: { language: "printscript" },
            headers: {
                id: 1
            }
        }); //8082 es snippet
        return response.data;
    }

    async getLintingRules(): Promise<Rule[]> {
        const response = await axios.get("http://localhost:8082/snippets/config/linting", {
            params: {language: "printscript"},
            headers: {
                id: 1
            }
        }); //8082 es snippet
        console.log(response.data)
        return response.data;
    }

    async getTestCases(): Promise<TestCase[]> {
        const response = await axios.get("http://localhost:8082/test", {
            headers: {
                id: 1
            }
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

    async formatSnippet(snippet: string): Promise<string> {
        const response = await axios.post("http://localhost:8082/actions/format", {
            params: {
                code: snippet
            },
            headers: {
                id: 1
            }
        }); //8082 es snippet
        console.log(response.data)
        return response.data;
    }

    async getFileTypes(): Promise<FileType[]> {
        console.log("getFileTypes")
        const response = await axios.get("http://localhost:8082/actions/type", {
            headers: {
                id: 1,
            }
        });
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error("Response is not an array");
        }
    }
    postTestCase(testCase: Partial<TestCase>, id: string): Promise<TestCase> {
        console.log(id, testCase);
        return axios.post("http://localhost:8082/test", {
            id: id,
            name: testCase.name,
            input: testCase.input || [],
            output: testCase.output || []
        }, {
            headers: {
                id: 1
            }
        });
    }

    removeTestCase(id: string): Promise<string> {
        return axios.delete(`http://localhost:8082/test/${id}`, {
            headers: {
                id: 1
            }
        }) //8082 es snippet
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log(testCase.id)
        const response = await axios.put("http://localhost:8082/test/execute", {
                id: testCase.id,
                name: testCase.name,
                input: testCase.input || [],
                output: testCase.output || [],
            }, {
            headers: {
                id: 1
            }
        }); //8082 es snippet
        return response.data as TestCaseResult;
    }

}