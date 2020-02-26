import { ConfigParams } from 'pip-services3-commons-node';

import { PostsFilePersistence } from '../../src/persistence/PostsFilePersistence';
import { PostsPersistenceFixture } from './PostsPersistenceFixture';

suite('PostsFilePersistence', () => {
    let persistence: PostsFilePersistence;
    let fixture: PostsPersistenceFixture;

    setup((done) => {
        persistence = new PostsFilePersistence('data/posts.test.json');
        persistence.configure(new ConfigParams());

        fixture = new PostsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilters(done);
    });

});