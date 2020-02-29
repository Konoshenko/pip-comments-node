let _ = require('lodash');
let async = require('async');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';

import { PostV1 } from '../data/v1/PostV1';
import { IPostsPersistence } from '../persistence/IPostsPersistence';
import { IPostsController } from './IPostsController';
import { PostStatusV1 } from '../data/v1/PostStatusV1';
import { PostsCommandSet } from './PostsCommandSet';

export class PostsController implements IPostsController, IConfigurable, IReferenceable, ICommandable
{


    private _persistence: IPostsPersistence;
    private _commandSet: PostsCommandSet;

    public constructor () { }

    public configure(config: ConfigParams): void
    {

    }

    public setReferences(references: IReferences): void
    {
        this._persistence = references.getOneRequired<IPostsPersistence>(
            new Descriptor('posts', 'persistence', '*', '*', '1.0')
        );
    }

    public getCommandSet(): CommandSet
    {
        if (this._commandSet == null)
        {
            this._commandSet = new PostsCommandSet(this);
        }
        return this._commandSet;
    }

    public getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void
    {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getPostById(correlationId: string, postId: string,
        callback: (err: any, page: PostV1) => void): void
    {
        this._persistence.getOneById(correlationId, postId, callback);
    }

    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void
    {
        post.id = post.id || IdGenerator.nextLong();
        post.status = post.status || PostStatusV1.Public;
        post.create_time = new Date(Date.now()).toISOString();
        post.update_time = post.create_time;
        this._persistence.create(correlationId, post, callback);
    }

    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void
    {
        post.status = post.status || PostStatusV1.Archive;
        post.update_time = new Date(Date.now()).toISOString();
        this._persistence.update(correlationId, post, callback);
    }

    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void
    {
        async.waterfall([
            (callback) =>
            {
                this._persistence.getOneById(
                    correlationId,
                    postId,
                    (err, post) =>
                    {
                        callback(err, post);
                    }
                );
            },
            (deletePost, callback) =>
            {
                if (deletePost != null && deletePost.ref_post_id != "")
                {
                    this._persistence.getOneById(
                        correlationId,
                        deletePost.ref_post_id,
                        (err, post) =>
                        {
                            callback(err, deletePost, post);
                        }
                    );
                } else
                {
                    callback(null, deletePost, null)
                }
            },
            (deletePost, refPost, callback) =>
            {
                if (refPost != null)
                {
                    refPost.repost_count = refPost.repost_count - 1
                    this._persistence.update(correlationId, refPost, (err, updatedPost) =>
                    {
                        callback(err, deletePost)
                    })
                } else
                {
                    callback(null, deletePost)
                }

            },
            (deletedPost, callback) =>
            {
                this._persistence.deleteById(correlationId, deletedPost.id, callback);
            }
        ], (err, deletedPost) => { callback(err, err == null ? deletedPost : null); });

    }

    public addLike(correlationId: string, siteId: string,
        callback: (err: any, position: any) => void): void
    {
        let postN: PostV1;
        async.series([
            (callback) =>
            {
                this._persistence.getOneById(
                    correlationId,
                    siteId,
                    (err, page) =>
                    {
                        postN = page ? page : null;
                        callback(err);
                    }
                );
            },
            (callback) =>
            {
                if (postN != null)
                {
                    postN.like_count = postN.like_count + 1
                }
                callback();
            }
        ], (err) => { callback(err, err == null ? postN : null); });
    }

    public takeRepost(correlationId: string, postId: string, post: PostV1,
        callback: (err: any, position: any) => void): void
    {
        async.waterfall([
            (callback) =>
            {
                this._persistence.getOneById(
                    correlationId,
                    postId,
                    (err, post) =>
                    {
                        callback(err, post);
                    }
                );
            },
            (post, callback) =>
            {
                if (post != null)
                {
                    post.repost_count = post.repost_count + 1
                }
                callback();
            }, (callback) =>
            {
                post.ref_post_id = postId;
                this.createPost(correlationId, post, callback);
            }
        ], (err, repost) => { callback(err, err == null ? repost : null); });

    }

}