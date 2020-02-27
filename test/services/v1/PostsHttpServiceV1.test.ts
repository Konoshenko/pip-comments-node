let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
let restify = require('restify');

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { PostV1 } from '../../../src/data/v1/PostV1';
import { PostStatusV1 } from '../../../src/data/v1/PostStatusV1';
import { PostsMemoryPersistence } from '../../../src/persistence/PostsMemoryPersistence';
import { PostsController } from '../../../src/logic/PostsController';
import { PostsHttpServiceV1 } from '../../../src/services/v1/PostsHttpServiceV1';

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


suite('PostsHttpServiceV1', () => {
    let persistence: PostsMemoryPersistence;
    let controller: PostsController;
    let service: PostsHttpServiceV1;
    let rest: any;

    setup((done) => {
        let url = "http://localhost:3000";
        
        rest = restify.createJsonClient({ url: url, version: '*'});

        persistence = new PostsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new PostsController();
        controller.configure(new ConfigParams());

        service = new PostsHttpServiceV1();
        service.configure(ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        ));

        let references = References.fromTuples(
            new Descriptor('posts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('posts', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('posts', 'service', 'http', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, done);
        });
    });

    teardown((done) => {
        service.close(null, (err) => {
            persistence.close(null,done)
        });
    });

    test('CRUD Operations', (done) => {
        let beacon1: PostV1;

        async.series([
            // Create the first post
            (callback) => {
                rest.post('/v1/posts/create_post',
                    {
                        post: POST1
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);
                        assert.isObject(beacon);
                        assert.equal(POST1.author_id, beacon.author_id);
                        assert.equal(POST1.content_text, beacon.content_text);
                     
                        assert.equal(POST1.id, beacon.id);

                        callback();
                    }
                );
            },
            // Create the second post
            (callback) => {
                rest.post('/v1/posts/create_post',
                    {
                        post: POST2
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);
                        assert.isObject(beacon);
                        assert.equal(POST2.author_id, beacon.author_id);
                        assert.equal(POST2.content_text, beacon.content_text);
                        
                        assert.equal(POST2.id, beacon.id);

                        callback();
                    }
                );
            },
            // Get all posts
            (callback) => {
                rest.post('/v1/posts/get_posts',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        beacon1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the beacon
            (callback) => {
                beacon1.content_text = 'ABC';

                rest.post('/v1/posts/update_post',
                    {
                        post: beacon1
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);
                        assert.equal('ABC', beacon.content_text);

                        callback();
                    }
                )
            },
            // Get beacon by udi
            (callback) => {
                rest.post('/v1/posts/get_post_by_id',
                    {
                        id: beacon1.id
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);

                        callback();
                    }
                )
            },
            // // Calculate position for one beacon
            // (callback) => {
            //     rest.post('/v1/beacons/calculate_position',
            //         {
            //             site_id: '1',
            //             udis: ['00001']
            //         },
            //         (err, req, res, position) => {
            //             assert.isNull(err);

            //             assert.isObject(position);
            //             assert.equal('Point', position.type);
            //             assert.lengthOf(position.coordinates, 2);
            //             assert.equal(0, position.coordinates[0]);
            //             assert.equal(0, position.coordinates[1]);

            //             callback();
            //         }
            //     )
            // },
            // Delete the beacon
            (callback) => {
                rest.post('/v1/posts/delete_post_by_id',
                    {
                        post_id: beacon1.id
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);

                        callback();
                    }
                )
            },
            // Try to get deleted beacon
            (callback) => {
                rest.post('/v1/posts/get_post_by_id',
                    {
                        id: beacon1.id
                    },
                    (err, req, res, beacon) => {
                        assert.isNull(err);

                        //assert.isEmpty(beacon || null);

                        callback();
                    }
                )
            }
        ], done);
    });

});