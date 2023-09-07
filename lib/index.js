"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const compare_1 = require("./compare");
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
// const BASE_FILEPATH = "./base.yaml";
// const CURRENT_FILEPATH = "./current.yaml";
// async function init() {
//     const baseYaml = await promises.readFile(BASE_FILEPATH, "utf8").catch((err) => {
//         throw new Error(`Error reading ${BASE_FILEPATH}: ${err}`);
//     })
//     const currentYaml = await promises.readFile(CURRENT_FILEPATH, "utf8").catch((err) => {
//         throw new Error(`Error reading ${CURRENT_FILEPATH}: ${err}`);
//     })
//     const base = YAML.parse(baseYaml) as IFile;
//     const current = YAML.parse(currentYaml) as IFile;
//     const baseValues = mergeArrayOfObjects(Object.values(base));
//     const currentValues = mergeArrayOfObjects(Object.values(current));
//     const changes = compare(baseValues, currentValues);
//     console.log(changes)
// }
// init();
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (github_1.context.eventName !== 'pull_request' &&
                github_1.context.eventName !== 'pull_request_target') {
                throw new Error('This action only supports pull_request and pull_request_target events');
            }
            const { issue: { number: issue_number }, repo: { owner, repo: repo_name } } = github_1.context;
            const token = core.getInput('github-token');
            const currentStatsPath = core.getInput('current-path');
            const baseStatsPath = core.getInput('base-path');
            const title = (_a = core.getInput('title')) !== null && _a !== void 0 ? _a : '';
            const { rest } = (0, github_1.getOctokit)(token);
            const [currentStatsJson, baseStatsJson, { data: comments }] = yield Promise.all([
                (0, helpers_1.readFileToJson)(currentStatsPath),
                (0, helpers_1.readFileToJson)(baseStatsPath),
                rest.issues.listComments({
                    repo: repo_name,
                    owner,
                    issue_number
                })
            ]);
            const identifierComment = (0, helpers_1.getIdentifierComment)(title);
            const [currentComment, ...restComments] = comments.filter(comment => {
                var _a;
                return ((_a = comment.user) === null || _a === void 0 ? void 0 : _a.login) === 'github-actions[bot]' &&
                    comment.body &&
                    comment.body.includes(identifierComment);
            });
            const statsDiff = (0, compare_1.compare)(baseStatsJson, currentStatsJson);
            // const chunkModuleDiff = getChunkModuleDiff(baseStatsJson, currentStatsJson)
            const commentBody = (0, helpers_1.getCommentBody)(statsDiff, title);
            const promises = [];
            if (restComments.length > 1) {
                promises.push(...restComments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                    return rest.issues.deleteComment({
                        repo: repo_name,
                        owner,
                        comment_id: comment.id
                    });
                })));
            }
            if (currentComment) {
                promises.push(rest.issues.updateComment({
                    issue_number,
                    owner,
                    repo: repo_name,
                    body: commentBody,
                    comment_id: currentComment.id
                }));
            }
            else {
                promises.push(rest.issues.createComment({
                    issue_number,
                    owner,
                    repo: repo_name,
                    body: commentBody
                }));
            }
            yield Promise.all(promises);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
