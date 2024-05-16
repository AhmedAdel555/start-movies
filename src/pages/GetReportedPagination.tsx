import React, { useState, useEffect } from 'react';
import { firestore, collection, query, orderBy, getDocs, startAfter, limit, QueryDocumentSnapshot, DocumentData } from '../firebase';

interface ReportedComment {
  commentId: string;
  content: string;
  userReport: string;
  reportDate: Date;
  filmId: string;
}

const GetReportedComments: React.FC = () => {
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);
  const [lastComment, setLastComment] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const getReportedComments = async () => {
    try {
      const reportedCommentsCollection = collection(firestore, 'reportedComments');
      let q = query(reportedCommentsCollection, orderBy('reportDate', 'desc'), limit(1));

      if (lastComment) {
        q = query(reportedCommentsCollection, orderBy('reportDate', 'desc'), startAfter(lastComment), limit(1));
      }

      const commentsSnapshot = await getDocs(q);
      const newComments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          commentId: doc.id,
          content: data.content,
          userReport: data.userReport,
          reportDate: data.reportDate.toDate(),
          filmId: data.filmId,
        } as ReportedComment;
      });

      setReportedComments(prevComments => lastComment ? [...prevComments, ...newComments] : newComments);
      setLastComment(commentsSnapshot.docs[commentsSnapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error getting reported comments:", error);
    }
  };

  useEffect(() => {
    getReportedComments();
  }, []);

  return (
    <div className="reported-comments">
      {reportedComments.map(comment => (
        <div key={comment.commentId} className="comment">
          <p>{comment.content}</p>
          <p>Report date: {comment.reportDate.toString()}</p>
        </div>
      ))}
      <button onClick={getReportedComments}>Load More</button>
    </div>
  );
};

export default GetReportedComments;
