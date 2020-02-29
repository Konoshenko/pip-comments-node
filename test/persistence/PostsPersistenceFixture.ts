let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { PostV1 } from '../../src/data/v1/PostV1';
import { PostStatusV1 } from '../../src/data/v1/PostStatusV1';
import { IPostsPersistence } from '../../src/persistence/IPostsPersistence';

const POST1: PostV1 = {
    id: '1',
    author_id: '1',
    ref_post_id:"",
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
    ref_post_id:"",
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

const POST3: PostV1 = {
    id: '3',
    author_id: '2',
    ref_post_id:"",
    status: PostStatusV1.Archive,
    content_text: 'Third post in system',
    create_time: "string",
    update_time: "string",
    attachment_ids: ["asd","asd"],
    comment_count: 0,
    view_count: 0,
    repost_count: 0,
    report_count: 0,
    like_count: 0,
};


export class PostsPersistenceFixture {
    private _persistence: IPostsPersistence;

    public constructor(persistence: IPostsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateposts(done) {
        async.series([
            // Create the first post
            (callback) => {
                this._persistence.create(
                    null,
                    POST1,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isObject(post);
                        assert.equal(POST1.comment_count, post.comment_count);
                        assert.equal(POST1.content_text, post.content_text);
                        assert.equal(POST1.author_id, post.author_id);
                        assert.equal(POST1.status, post.status);
                        

                        callback();
                    }
                );
            },
            // Create the second post
            (callback) => {
                this._persistence.create(
                    null,
                    POST2,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isObject(post);
                        assert.equal(POST2.comment_count, post.comment_count);
                        assert.equal(POST2.content_text, post.content_text);
                        assert.equal(POST2.author_id, post.author_id);
                        assert.equal(POST2.status, post.status);
                    

                        callback();
                    }
                );
            },
            // Create the third post
            (callback) => {
                this._persistence.create(
                    null,
                    POST3,
                    (err, post) => {
                        assert.isNull(err);
                        assert.isObject(post);
                        assert.equal(POST3.comment_count, post.comment_count);
                        assert.equal(POST3.content_text, post.content_text);
                        assert.equal(POST3.author_id, post.author_id);
                        assert.equal(POST3.status, post.status);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testCrudOperations(done) {
        let postV1: PostV1;

        async.series([
            // Create items
            (callback) => {
                this.testCreateposts(callback);
            },
            // Get all posts
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        postV1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the post
            (callback) => {
                postV1.content_text = 'ABC';

                this._persistence.update(
                    null,
                    postV1,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isObject(post);
                        assert.equal(postV1.id, post.id);
                        assert.equal('ABC', post.content_text);

                        callback();
                    }
                )
            },
            //Get post by id
            (callback) => {
                this._persistence.getOneById(
                    null,
                    postV1.id,
                    (err, post) => {
                        assert.isNull(err);
                        assert.isObject(post);
                        assert.equal(postV1.id, post.id);

                        callback();
                    }
                )
            },
            // Delete the post
            (callback) => {
                this._persistence.deleteById(
                    null,
                    postV1.id,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isObject(post);
                        assert.equal(postV1.id, post.id);

                        callback();
                    }
                )
            },
            // Try to get deleted post
            (callback) => {
                this._persistence.getOneById(
                    null,
                    postV1.id,
                    (err, post) => {
                        assert.isNull(err);

                        assert.isNull(post || null);

                        callback();
                    }
                )
            }
        ], done);
    }

    public testGetWithFilters(done) {
        async.series([
            // Create items
            (callback) => {
                this.testCreateposts(callback);
            },
            // Filter by id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'id', '1'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
            // Filter by udi
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'author_id', '1'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            //Filter by author_ids
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'author_ids', '1,2'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                )
            },
            // Filter by site_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'status', PostStatusV1.Public
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
        ], done);
    }
}
