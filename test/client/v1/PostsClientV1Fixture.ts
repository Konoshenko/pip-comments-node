let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { PostV1 } from '../../../src/data/v1/PostV1';
import { PostStatusV1 } from '../../../src/data/v1/PostStatusV1';
import { IPostsClientV1 } from '../../../src/client/v1/IPostsClientV1';

const POST1: PostV1 = {
    id: '1',
    author_id: '1',
    status: PostStatusV1.Public,
    content_text: 'First post in system',
    create_time: "string",
    update_time: "string",
    attachment_ids: ["asd","asd"],
    comment_count: 0,
    view_count: 0,
    repost_count: 0,
    report_count: 0,
    like_count: 0,
};

const POST2: PostV1 = {
    id: '2',
    author_id: '1',
    status: PostStatusV1.Archive,
    content_text: 'Second post in system',
    create_time: "string",
    update_time: "string",
    attachment_ids: ["asd","asd"],
    comment_count: 0,
    view_count: 0,
    repost_count: 0,
    report_count: 0,
    like_count: 0,
};

export class PostsClientV1Fixture {
    private _client: IPostsClientV1;

    public constructor(client: IPostsClientV1) {
        assert.isNotNull(client);
        this._client = client;
    }

    public testCrudOperations(done) {
        let post1: PostV1;

        async.series([
            // Create the first beacon
            (callback) => {
                this._client.createPost(
                    null,
                    POST1,
                    (err, post) => {
                        assert.isNull(err);
                        assert.isObject(post);
                        assert.equal(POST1.author_id, post.author_id);
                        assert.equal(POST1.content_text, post.content_text);
                    
                        assert.equal(POST1.id, post.id);

                        callback();
                    }
                );
            },
            // Create the second beacon
            (callback) => {
                this._client.createPost(
                    null,
                    POST2,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isObject(post);
                        assert.equal(POST2.author_id, post.author_id);
                        assert.equal(POST2.content_text, post.content_text);
            
                        assert.equal(POST2.id, post.id);

                        callback();
                    }
                );
            },
            // Get all beacons
            (callback) => {
                this._client.getPosts(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        post1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the beacon
            (callback) => {
                post1.content_text = 'ABC';

                this._client.updatePost(
                    null,
                    post1,
                    (err, post) => {
                        assert.isNull(err);
                        assert.isObject(post);
                        assert.equal(post1.id, post.id);
                        assert.equal('ABC', post.content_text);

                        callback();
                    }
                )
            },
            // Get beacon by udi
            // (callback) => {
            //     this._client.getPostByAuthorId(
            //         null, 
            //         post1.author_id,
            //         (err, beacon) => {
            //             assert.isNull(err);

            //             assert.isObject(beacon);
            //             assert.equal(post1.id, beacon.id);

            //             callback();
            //         }
            //     )
            // },
            // Delete the beacon
            (callback) => {
                this._client.deletePostById(
                    null,
                    post1.id,
                    (err, post) => {
                        assert.isNull(err);
                        assert.isObject(post);
                        assert.equal(post1.id, post.id);
                        callback();
                    }
                )
            },
            // Try to get deleted beacon
            (callback) => {
                this._client.getPostById(
                    null,
                    post1.id,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isNull(beacon || null);

                        callback();
                    }
                )
            }
        ], done);
    }

    public testTakeRepost(done) {
        async.series([
            // Create the first beacon
            (callback) => {
                this._client.createPost(
                    null,
                    POST1,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(POST1.id, beacon.id);
                    
                        callback();
                    }
                );
            },
            // Take repost
            (callback) => {
                this._client.takeRepostByPostId(
                    null,
                    POST1.id,
                    (err, beacon) => {
                        assert.isNull(err);
                        assert.isObject(beacon);
                        assert.equal(POST1.content_text, beacon.content_text);
                        assert.notEqual(POST1.id, beacon.id);
                        callback();
                    }
                );
            },
        ], done);
    }
}

