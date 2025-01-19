import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function MyPhoto() {
  const [image, setImage] = useState<string | null>(null); 
  const [description, setDescription] = useState(""); 
  const [loading, setLoading] = useState(false);

  const storage = getStorage();
  const firestore = getFirestore();
  const auth = getAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please select an image to upload.");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      const imageName = `${user?.uid}-${Date.now()}.jpg`;
      const storageRef = ref(storage, `photos/${imageName}`);

      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      const docRef = doc(firestore, "photos", imageName);
      await setDoc(docRef, {
        uid: user?.uid,
        downloadURL,
        description,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Image uploaded successfully!");
      setImage(null);
      setDescription("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to upload the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Photo</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Select an Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Add a description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.button} onPress={uploadImage} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Uploading..." : "Upload"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafd" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  imagePicker: {
    height: 200,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  imageText: { color: "#888" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  input: {
    height: 50,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "bold" },
});
