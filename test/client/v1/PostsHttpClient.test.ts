import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { PostsMemoryPersistence } from '../../../src/persistence/PostsMemoryPersistence';
import { PostsController } from '../../../src/logic/PostsController';
import { PostsHttpServiceV1 } from '../../../src/services/v1/PostsHttpServiceV1';
import { PostsHttpClientV1 } from '../../../src/client/v1/PostsHttpClientV1';
import { PostsClientV1Fixture } from './PostsClientV1Fixture';

suite('PostsHttpClientV1', () => {
    let persistence:PostsMemoryPersistence;
    let controller: PostsController;
    let service: PostsHttpServiceV1;
    let client: PostsHttpClientV1;
    let fixture: PostsClientV1Fixture;

    setup((done) => {
        persistence = new PostsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new PostsController();
        controller.configure(new ConfigParams());

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );

        service = new PostsHttpServiceV1();
        service.configure(httpConfig);

        client = new PostsHttpClientV1();
        client.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('posts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('posts', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('posts', 'service', 'http', 'default', '1.0'), service,
            new Descriptor('posts', 'client', 'http', 'default', '1.0'), client
        );
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);

        fixture = new PostsClientV1Fixture(client);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, (err) => {
                if (err) {
                    done(err);
                    return;
                }

                client.open(null, done);
            });
        });
    });

    teardown((done) => {
        client.close(null, (err) => {
            service.close(null, (err) => {
                persistence.close(null, done);
            });    
        });
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Take repost Position', (done) => {
        fixture.testTakeRepost(done);
    });

});