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

export class PostsController implements IPostsController, IConfigurable, IReferenceable, ICommandable {


    private _persistence: IPostsPersistence;
    private _commandSet: PostsCommandSet;

    public constructor() { }

    public configure(config: ConfigParams): void {

    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IPostsPersistence>(
            new Descriptor('posts', 'persistence', '*', '*', '1.0')
        );
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new PostsCommandSet(this);
        }

        return this._commandSet;
    }

    public getPosts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    public getPostById(correlationId: string, postId: string,
        callback: (err: any, page: PostV1) => void): void {
        this._persistence.getOneById(correlationId, postId, callback);
    }

    public getPostByAuthor(correlationId: string, authorId: string,
        callback: (err: any, page: PostV1) => void): void {
        throw new Error("Method not implemented.");
    }

    public createPost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        post.id = post.id || IdGenerator.nextLong();
        post.status = post.status || PostStatusV1.Public;
        this._persistence.create(correlationId, post, callback);
    }
    public updatePost(correlationId: string, post: PostV1,
        callback: (err: any, post: PostV1) => void): void {
        post.status = post.status || PostStatusV1.Archive;
        this._persistence.update(correlationId, post, callback);
    }
    public deletePostById(correlationId: string, postId: string,
        callback: (err: any, post: PostV1) => void): void {
        this._persistence.deleteById(correlationId, postId, callback);
    }


    // public calculatePosition(correlationId: string, siteId: string, udis: string[],
    //     callback: (err: any, position: any) => void): void {
    //         let beacons: BeaconV1[];
    //         let position: any = null;

    //         if (udis == null || udis.length == 0) {
    //             callback(null, null);
    //             return;
    //         }

    //         async.series([
    //             (callback) => {
    //                 this._persistence.getPageByFilter(
    //                     correlationId,
    //                     FilterParams.fromTuples(
    //                         'site_id', siteId,
    //                         'udis', udis
    //                     ),
    //                     null,
    //                     (err, page) => {
    //                         beacons = page ? page.data : [];
    //                         callback(err);
    //                     }
    //                 );
    //             },
    //             (callback) => {
    //                 let lat = 0;
    //                 let lng = 0;
    //                 let count = 0;

    //                 for (let beacon of beacons) {
    //                     if (beacon.center != null 
    //                         && beacon.center.type == 'Point'
    //                         && _.isArray(beacon.center.coordinates)) {
    //                             lng += beacon.center.coordinates[0];
    //                             lat += beacon.center.coordinates[1];
    //                             count += 1;
    //                         }
    //                 }

    //                 if (count > 0) {
    //                     position = {
    //                         type: 'Point',
    //                         coordinates: [lng / count, lat / count]
    //                     }
    //                 }

    //                 callback();
    //             }
    //         ], (err) => { callback(err, err == null ? position : null);  });
    // }


}