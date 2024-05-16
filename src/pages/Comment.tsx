import React, { useState, useEffect } from 'react';
import {
    firestore,
    auth,
    collection,
    doc,
    setDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    getDoc,
    QueryDocumentSnapshot,
    query,
    orderBy,
    startAfter,
    limit
} from "../firebase"; // Adjust the import based on your project structure

type Props = {
    filmId: string;
};

type Comment = {
    id: string;
    publisherId: string;
    content: string;
    likes: string[];
    likesNumber: number;
    dislikes: string[];
    dislikesNumber: number;
    publishDate: Date;
};

const CommentBackend = ({ filmId }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [lastComment, setLastComment] = useState<QueryDocumentSnapshot | null>(null);

    useEffect(() => {
        fetchComments();
    }, [filmId]);

    const fetchComments = async () => {
        try {
            const commentsCollection = collection(firestore, 'films', filmId, 'comments');
            let q = query(commentsCollection, orderBy('publishDate', 'desc'));
    
            if (lastComment) {
                q = query(commentsCollection, orderBy('publishDate', 'desc'), startAfter(lastComment), limit(1));
            } else {
                q = query(commentsCollection, orderBy('publishDate', 'desc'), limit(1));
            }
    
            const commentsSnapshot = await getDocs(q);
            const newComments = commentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                publishDate: doc.data().publishDate.toDate()
            })) as Comment[];
    
            setComments(prevComments => lastComment ? [...prevComments, ...newComments] : newComments);
            setLastComment(commentsSnapshot.docs[commentsSnapshot.docs.length - 1] || null);
        } catch (error) {
            console.error("Error getting comments:", error);
        }
    };
    

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = "yc2LyI6UcBhGjO3qgbPeDEm8CLY2";
        const commentsCollection = collection(firestore, 'films', filmId, 'comments');
        const newCommentRef = doc(commentsCollection);
    
        try {
            await setDoc(newCommentRef, {
                publisherId: userId,
                content: newComment,
                publishDate: serverTimestamp(),
                likes: [],
                likesNumber: 0,
                dislikes: [],
                dislikesNumber: 0,
            });
    
            const newCommentSnapshot = await getDoc(newCommentRef);
            if (newCommentSnapshot.exists()) {
                const newCommentData = { id: newCommentSnapshot.id, ...newCommentSnapshot.data(), publishDate: newCommentSnapshot.data().publishDate.toDate() } as Comment;
                setComments([newCommentData, ...comments]);
            }
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    
    
    const toggleCommentLike = async (commentId: string, userId: string) => {
        const commentRef = doc(firestore, 'films', filmId, 'comments', commentId);
        const commentSnapshot = await getDoc(commentRef);
        if (commentSnapshot.exists()) {
            const { likes, likesNumber } = commentSnapshot.data() as Comment;
            if (likes.includes(userId)) {
                await updateDoc(commentRef, {
                    likes: arrayRemove(userId),
                    likesNumber: likesNumber - 1,
                });
            } else {
                await updateDoc(commentRef, {
                    likes: arrayUnion(userId),
                    likesNumber: likesNumber + 1,
                });
            }
            // Update the comment in the state without fetching comments again
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              likes: likes.includes(userId)
                                  ? likes.filter(id => id !== userId)
                                  : [...likes, userId],
                              likesNumber: likes.includes(userId)
                                  ? likesNumber - 1
                                  : likesNumber + 1,
                          }
                        : comment
                )
            );
        }
    };

    const toggleCommentDislike = async (commentId: string, userId: string) => {
        const commentRef = doc(firestore, 'films', filmId, 'comments', commentId);
        const commentSnapshot = await getDoc(commentRef);

        if (commentSnapshot.exists()) {
            const { dislikes, dislikesNumber } = commentSnapshot.data() as Comment;
            if (dislikes.includes(userId)) {
                await updateDoc(commentRef, {
                    dislikes: arrayRemove(userId),
                    dislikesNumber: dislikesNumber - 1,
                });
            } else {
                await updateDoc(commentRef, {
                    dislikes: arrayUnion(userId),
                    dislikesNumber: dislikesNumber + 1,
                });
            }
            // Update the comment in the state without fetching comments again
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              dislikes: dislikes.includes(userId)
                                  ? dislikes.filter(id => id !== userId)
                                  : [...dislikes, userId],
                              dislikesNumber: dislikes.includes(userId)
                                  ? dislikesNumber - 1
                                  : dislikesNumber + 1,
                          }
                        : comment
                )
            );
        }
    };

    const reportComment = async (commentId: string, userId: string, content:string) => {
        const reportCollection = collection(firestore, 'reportedComments');
        await setDoc(doc(reportCollection, commentId), {
            userReport: userId,
            filmId,
            commentId,
            reportDate: serverTimestamp(),
            content
        });
        console.log("Comment reported.");
    };
    

    const deleteComment = async (commentId: string) => {
        try {
            await deleteDoc(doc(firestore, 'films', filmId, 'comments', commentId));
            setComments(comments.filter(comment => comment.id !== commentId));
            console.log("Comment deleted successfully.");
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <p>{comment.content}</p>
                        <div className="comment-actions">
                            <button onClick={() => toggleCommentLike(comment.id, "yc2LyI6UcBhGjO3qgbPeDEm8CLY2")}>Like {comment.likesNumber}</button>
                            <button onClick={() => toggleCommentDislike(comment.id, "yc2LyI6UcBhGjO3qgbPeDEm8CLY2")}>Dislike {comment.dislikesNumber}</button>
                            <button onClick={() => reportComment(comment.id, "yc2LyI6UcBhGjO3qgbPeDEm8CLY2",comment.content)}>Report</button>
                            {comment.publisherId === "yc2LyI6UcBhGjO3qgbPeDEm8CLY2" && <button onClick={() => deleteComment(comment.id)}>Delete</button>}
                            {"" && <button onClick={() => deleteComment(comment.id)}>Admin Delete</button>}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => fetchComments()}>Load More</button>
        </div>
    );
};

export default CommentBackend;
