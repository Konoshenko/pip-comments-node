import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { PostV1 } from '../../src/data/v1/PostV1';

export interface IPostsController {
    getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void;

    getPostById(correlationId: string, postId: string,
        callback: (err: any, page: PostV1) => void): void;

    getPostByAuthor(correlationId: string, authorId: string,
        callback: (err: any, page: PostV1) => void): void;

    createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void;

    updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void;

    deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void;
}