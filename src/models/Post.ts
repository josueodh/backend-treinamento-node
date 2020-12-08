import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './User';
import Comment from './Comment';
@Entity('posts')
class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('integer')
    like: number;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @Column()
    imageUrl: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Post;