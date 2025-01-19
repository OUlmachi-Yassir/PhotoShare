import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { getAuth } from "firebase/auth";  

type Comment = {
  author: string;
  comment: string;
};

type ImageData = {
  id: string;
  url: string;
  createdAt: string;
  comments: Comment[];
};

type User = {
  id: string;
  name: string;
  email: string;
  images: ImageData[];
};

type Data = {
  users: User[];
};

const usersData: Data = require('../../users.json');

export default function ImageGallery() {
  const [data, setData] = useState<Data | null>(null);
  const [comment, setComment] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<{ userId: string; imageId: string } | null>(null);

  useEffect(() => {
    setData(usersData);
  }, []);

  const getCurrentUserName = () => {
    const user = getAuth().currentUser;
    console.log(user);
    if (user) {
      return user.displayName || user.email || "Anonymous"; 
    }
    return "Anonymous"; 
  };

  const addComment = (userId: string, imageId: string) => {
    if (!comment.trim()) {
      Alert.alert("Comment cannot be empty!");
      return;
    }

    const currentUserName = getCurrentUserName(); 

    const updatedData = { ...data! };
    const user = updatedData.users.find((user) => user.id === userId);
    const image = user?.images.find((img) => img.id === imageId);

    if (image) {
      image.comments.push({ author: currentUserName, comment });
      setData(updatedData);
      setComment(""); 
      setSelectedImage(null); 
    }
  };

  return (
    <View style={styles.container}>
      {data && (
        <FlatList
          data={data.users}
          keyExtractor={(item) => item.id}
          renderItem={({ item: user }) => (
            <View style={styles.card}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              {user.images.length === 0 ? (
                <Text style={styles.noImages}>No images uploaded.</Text>
              ) : (
                user.images.map((image) => (
                  <View key={image.id} style={styles.imageSection}>
                    <Image source={{ uri: image.url }} style={styles.image} />
                    <Text style={styles.imageDate}>
                      Uploaded: {new Date(image.createdAt).toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      style={styles.commentButton}
                      onPress={() => setSelectedImage({ userId: user.id, imageId: image.id })}
                    >
                      <Text style={styles.buttonText}>Comment</Text>
                    </TouchableOpacity>
                    <View style={styles.comments}>
                      {image.comments.map((c, index) => (
                        <Text key={index} style={styles.comment}>
                          {c.author}: {c.comment}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        />
      )}

      {selectedImage && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Add a Comment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your comment"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() =>
              selectedImage && addComment(selectedImage.userId, selectedImage.imageId)
            }
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  card: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 20, padding: 15 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#555", marginBottom: 10 },
  noImages: { fontStyle: "italic", color: "#999" },
  imageSection: { marginTop: 10 },
  image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 5 },
  imageDate: { fontSize: 12, color: "#777" },
  commentButton: { backgroundColor: "#4caf50", borderRadius: 5, padding: 10, marginTop: 5 },
  comments: { marginTop: 10 },
  comment: { fontSize: 14, color: "#333", backgroundColor: "#f1f1f1", borderRadius: 5, padding: 5 },
  popup: { position: "absolute", top: "40%", left: "10%", right: "10%", backgroundColor: "#fff", padding: 20, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
  popupTitle: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  submitButton: { backgroundColor: "#4caf50", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
