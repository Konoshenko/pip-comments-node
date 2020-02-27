
import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { PostsMemoryPersistence } from '../../../src/persistence/PostsMemoryPersistence';
import { PostsController } from '../../../src/logic/PostsController';
import { PostsDirectClientV1 } from '../../../src/client/v1/PostsDirectClientV1';
import { PostsClientV1Fixture } from './PostsClientV1Fixture';

suite('PostsDirectClientV1', () => {
    let persistence: PostsMemoryPersistence;
    let controller: PostsController;
    let client: PostsDirectClientV1;
    let fixture: PostsClientV1Fixture;

    setup((done) => {
        persistence = new PostsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new PostsController();
        controller.configure(new ConfigParams());

        client = new PostsDirectClientV1();

        let references = References.fromTuples(
            new Descriptor('posts', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('posts', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('posts', 'client', 'direct', 'default', '1.0'), client
        );

        controller.setReferences(references);
        client.setReferences(references);

        fixture = new PostsClientV1Fixture(client);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    // test('Calculate Positions', (done) => {
    //     fixture.testCalculatePosition(done);
    // });
});