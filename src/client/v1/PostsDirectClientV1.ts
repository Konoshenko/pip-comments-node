import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { DirectClient } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

import { PostV1 } from '../../../src/data/v1/PostV1';
import { IPostsClientV1 } from './IPostsClientV1';
import { IPostsController } from '../../../src/logic/IPostsController';

export class PostsDirectClientV1 extends DirectClient<IPostsController> implements IPostsClientV1 {
   
    
    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('posts', 'controller', '*', '*', '1.0'));
    }

    public getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        let timing = this.instrument(correlationId, 'posts.get_posts');
        this._controller.getPosts(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }

    public getPostById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.get_post_by_id');
        this._controller.getPostById(correlationId, beaconId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public getPostByAuthorId(correlationId: string, authorId: string,
        callback: (err: any, beacon: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.get_post_by_author_id');
        this._controller.getPostByAuthor(correlationId, authorId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    // public calculatePosition(correlationId: string, siteId: string, udis: string[], 
    //     callback: (err: any, position: any) => void): void {
    //     let timing = this.instrument(correlationId, 'beacons.calculate_position');
    //     this._controller.calculatePosition(correlationId, siteId, udis, (err, position) => {
    //         timing.endTiming();
    //         callback(err, position);
    //     }); 
    // }

    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, beacon: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.create_post');
        this._controller.createPost(correlationId, post, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, beacon: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.update_post');
        this._controller.updatePost(correlationId, post, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, beacon: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.delete_post_by_id');
        this._controller.deletePostById(correlationId, postId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }
}