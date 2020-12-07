import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';
import Post from './Post';

@Entity('comments')
class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    text: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    post_id: string;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;


}

export default Comment;