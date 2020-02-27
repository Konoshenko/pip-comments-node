import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { CommandableHttpClient } from 'pip-services3-rpc-node';

import { PostV1 } from '../../data/v1/PostV1';
import { IPostsClientV1 } from './IPostsClientV1';

export class PostsHttpClientV1 extends CommandableHttpClient implements IPostsClientV1 {


    public constructor() {
        super('v1/posts');
    }
    addLikeToPost(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        this.callCommand(
            'add_like_to_post',
            correlationId,
            {
                post_id: postId
            },
            callback
        );
    }

    public getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        this.callCommand(
            'get_posts',
            correlationId,
            { filter: filter, paging: paging },
            callback
        );
    }

    public getPostById(correlationId: string, postId: string,
        callback: (err: any, beacon: PostV1) => void): void {
        this.callCommand(
            'get_post_by_id',
            correlationId,
            {
                id: postId
            },
            callback
        );
    }

    public getPostByAuthorId(correlationId: string, authorId: string,
        callback: (err: any, beacon: PostV1) => void): void {
        this.callCommand(
            'get_post_by_author_id',
            correlationId,
            {
                author_id: authorId
            },
            callback
        );
    }

    // public calculatePosition(correlationId: string, siteId: string, udis: string[], 
    //     callback: (err: any, position: any) => void): void {
    //     this.callCommand(
    //         'calculate_position',
    //         correlationId,
    //         {
    //             site_id: siteId,
    //             udis: udis
    //         },
    //         callback
    //     );    
    // }

    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        this.callCommand(
            'create_post',
            correlationId,
            {
                post: post
            },
            callback
        );
    }

    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        this.callCommand(
            'update_post',
            correlationId,
            {
                post: post
            },
            callback
        );
    }

    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        this.callCommand(
            'delete_post_by_id',
            correlationId,
            {
                post_id: postId
            },
            callback
        );
    }
}