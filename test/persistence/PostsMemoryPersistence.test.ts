import { ConfigParams } from 'pip-services3-commons-node';

import { PostsMemoryPersistence } from '../../src/persistence/PostsMemoryPersistence';
import { PostsPersistenceFixture } from './PostsPersistenceFixture';

suite('PostsMemoryPersistence', () => {
    let persistence: PostsMemoryPersistence;
    let fixture: PostsPersistenceFixture;

    setup((done) => {
        persistence = new PostsMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new PostsPersistenceFixture(persistence);

        persistence.open(null, done);
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