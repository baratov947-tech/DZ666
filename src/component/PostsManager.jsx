import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PostsManager.module.css';

export default function PostsManager() {
     const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

     const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Индикатор загрузки для кнопки

     useEffect(() => {
        axios.get('https://dummyjson.com/posts')
            .then((response) => {
                setPosts(response.data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке:', error);
                setIsLoading(false);
            });
    }, []);

     const handleDelete = (id) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

     const handleSubmit = (e) => {
        e.preventDefault();

         if (!title.trim() || !body.trim()) {
            alert('Пожалуйста, заполните оба поля (Заголовок и Текст)!');
            return;
        }

        setIsSubmitting(true);

         axios.post('https://dummyjson.com/posts/add', {
            title: title,
            body: body,
            userId: 1,
        })
            .then((response) => {
                alert('Пост успешно добавлен!');

                setPosts((prevPosts) => [response.data, ...prevPosts]);

                setTitle('');
                setBody('');
            })
            .catch((error) => {
                console.error('Ошибка при отправке:', error);
                alert('Произошла ошибка при добавлении.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className={styles.container}>
            {/* Форма создания поста */}
            <div className={styles.formCard}>
                <h2>Создать новый пост</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Заголовок (title)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="Текст поста (body)"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className={styles.textarea}
                    />
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </form>
            </div>

            <hr className={styles.divider} />

            {/* Список постов */}
            <h2>Лента постов ({posts.length})</h2>

            {isLoading ? (
                <div className={styles.loading}>Загрузка постов...</div>
            ) : (
                <div className={styles.postsList}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <div className={styles.postContent}>
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>
                            </div>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(post.id)}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}