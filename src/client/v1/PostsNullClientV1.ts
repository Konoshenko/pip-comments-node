import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { PostV1 } from '../../data/v1/PostV1';
import { IPostsClientV1 } from './IPostsClientV1';

export class PostsNullClientV1 implements IPostsClientV1 {
    
    getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        callback(null, new DataPage([], 0));
    }

    public getPostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        callback(null, null);
    }

    public getPostByAuthorId(correlationId: string, udi: string,
        callback: (err: any, post: PostV1) => void): void {
        callback(null, null);
    }

    // public calculatePosition(correlationId: string, siteId: string, udis: string[], 
    //     callback: (err: any, position: any) => void): void {
    //     callback(null, null);
    // }

    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        callback(null, null);
    }

    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        callback(null, null);
    }

    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        callback(null, null);
    }

}