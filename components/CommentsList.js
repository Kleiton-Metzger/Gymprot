import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { db } from '../storage/Firebase';
import { collection, query, onSnapshot, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../Hooks/useAuth';

const CommentsList = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAvatars, setUserAvatars] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Query to get comments for a specific video
        const commentsQuery = query(collection(db, 'comments'), where('videoId', '==', videoId));

        const unsubscribe = onSnapshot(commentsQuery, async querySnapshot => {
          const comments = [];
          const userIds = [];

          querySnapshot.forEach(doc => {
            const data = doc.data();
            comments.push({ id: doc.id, ...data });
            if (data.userId && !userIds.includes(data.userId)) {
              userIds.push(data.userId);
            }
          });

          setComments(comments);

          const fetchAvatars = async () => {
            const avatars = {};
            for (const userId of userIds) {
              try {
                const userDocRef = doc(db, 'users', userId); // Use doc with userId
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  const userData = userDocSnap.data();
                  avatars[userId] = userData.avatar;
                }
              } catch (error) {
                console.error('Error fetching user avatar: ', error);
              }
            }
            setUserAvatars(avatars);
          };

          await fetchAvatars();

          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching comments: ', error);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleDeleteComment = async commentId => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.commentContainer}>
          <Image
            source={userAvatars[item.userId] ? { uri: userAvatars[item.userId] } : require('../assets/avatar.png')}
            style={styles.avatar}
          />

          <Text style={styles.userName}>{item.userName}:</Text>
          <Text>{item.comment}</Text>
          {currentUser.userId === item.userId && (
            <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={styles.container}>
          <Text style={styles.emptyText}>Sem comentários ainda...</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  commentContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    width: '98%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontWeight: 'bold',
    color: '#581DB9',
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FFEFEF',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
});

export default CommentsList;
