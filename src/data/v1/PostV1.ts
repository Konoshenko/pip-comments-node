import { IStringIdentifiable } from 'pip-services3-commons-node';

export class PostV1 implements IStringIdentifiable {
    public id: string; 
    public author_id: string; 
    public status: string; 
    public create_time: string; 
    public update_time: string; 
    public content_text: string;
    public attachment_ids?: string[];
    public comment_count?: number; 
    public view_count?: number; 
    public repost_count?: number;
    public report_count?: number; 
    public like_count?: number; 
}