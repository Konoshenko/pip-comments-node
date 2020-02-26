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

const POST3: PostV1 = {
    id: '3',
    author_id: '2',
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

    private testCreateBeacons(done) {
        async.series([
            // Create the first beacon
            (callback) => {
                this._persistence.create(
                    null,
                    POST1,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(POST1.comment_count, beacon.comment_count);
                        assert.equal(POST1.content_text, beacon.content_text);
                        assert.equal(POST1.author_id, beacon.author_id);
                        assert.equal(POST1.status, beacon.status);
                        

                        callback();
                    }
                );
            },
            // Create the second beacon
            (callback) => {
                this._persistence.create(
                    null,
                    POST2,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(POST2.comment_count, beacon.comment_count);
                        assert.equal(POST2.content_text, beacon.content_text);
                        assert.equal(POST2.author_id, beacon.author_id);
                        assert.equal(POST2.status, beacon.status);
                    

                        callback();
                    }
                );
            },
            // Create the third beacon
            (callback) => {
                this._persistence.create(
                    null,
                    POST3,
                    (err, beacon) => {
                        assert.isNull(err);
                        assert.isObject(beacon);
                        assert.equal(POST3.comment_count, beacon.comment_count);
                        assert.equal(POST3.content_text, beacon.content_text);
                        assert.equal(POST3.author_id, beacon.author_id);
                        assert.equal(POST3.status, beacon.status);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testCrudOperations(done) {
        let beacon1: PostV1;

        async.series([
            // Create items
            (callback) => {
                this.testCreateBeacons(callback);
            },
            // Get all beacons
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        beacon1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the beacon
            (callback) => {
                beacon1.content_text = 'ABC';

                this._persistence.update(
                    null,
                    beacon1,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);
                        assert.equal('ABC', beacon.content_text);

                        callback();
                    }
                )
            },
            // Get beacon by udi
            // (callback) => {
            //     this._persistence.getOneByUdi(
            //         null,
            //         beacon1.udi,
            //         (err, beacon) => {
            //             assert.isNull(err);

            //             assert.isObject(beacon);
            //             assert.equal(beacon1.id, beacon.id);

            //             callback();
            //         }
            //     )
            // },
            // Delete the beacon
            (callback) => {
                this._persistence.deleteById(
                    null,
                    beacon1.id,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);

                        callback();
                    }
                )
            },
            // Try to get deleted beacon
            (callback) => {
                this._persistence.getOneById(
                    null,
                    beacon1.id,
                    (err, beacon) => {
                        assert.isNull(err);

                        assert.isNull(beacon || null);

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
                this.testCreateBeacons(callback);
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
