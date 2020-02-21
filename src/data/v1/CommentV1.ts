import { IStringIdentifiable } from 'pip-services3-commons-node';

export class CommentV1 implements IStringIdentifiable {
    public id: string;
    public post_id: string;
    public user_id: string;
    public type: string;
    public date: string;
    public label: string;
    public report_count?: number;
    public like_count?: number;
}