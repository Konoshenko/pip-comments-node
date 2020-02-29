import { Schema } from 'mongoose';

export let PostsMongoDbSchema = function (collection?: string) {
    collection = collection || 'posts';

    let schema = new Schema(
        {
            _id: { type: String },
            author_id: { type: String },
            status: { type: String },
            ref_post_id: { type: String },
            create_time: { type: String },
            update_time: { type: String },
            content_text: { type: String },
            attachment_ids: { type: [String], default: [] },
            comment_count: { type: Number, default: 0 },
            view_count: { type: Number, default: 0 },
            repost_count: { type: Number, default: 0 },
            report_count: { type: Number, default: 0 },
            like_count: { type: Number, default: 0 },
        },
        {
            collection: collection,
            autiIndex: true
        }
    );

    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}