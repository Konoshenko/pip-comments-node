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
        callback: (err: any, post: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.get_post_by_id');
        this._controller.getPostById(correlationId, beaconId, (err, post) => {
            timing.endTiming();
            callback(err, post);
        }); 
    }

    public addLikeToPost(correlationId: string, siteId: string, 
        callback: (err: any, position: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.add_like_to_post');
        this._controller.addLikeToPost(correlationId, siteId, (err, position) => {
            timing.endTiming();
            callback(err, position);
        }); 
    }

    public takeRepostByPostId(correlationId: string, postId: string, post: PostV1, 
        callback: (err: any, position: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.take_repost');
        this._controller.takeRepostByPostId(correlationId, postId,post, (err, position) => {
            timing.endTiming();
            callback(err, position);
        }); 
    }
    
    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.create_post');
        this._controller.createPost(correlationId, post, (err, post) => {
            timing.endTiming();
            callback(err, post);
        }); 
    }

    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.update_post');
        this._controller.updatePost(correlationId, post, (err, post) => {
            timing.endTiming();
            callback(err, post);
        }); 
    }

    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        let timing = this.instrument(correlationId, 'posts.delete_post_by_id');
        this._controller.deletePostById(correlationId, postId, (err, post) => {
            timing.endTiming();
            callback(err, post);
        }); 
    }
}