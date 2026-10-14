import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCVContext } from "../context/CVContext";

export default function PhotoScreen() {
  const { cvData, updatePersonalInfo } = useCVContext();
  const [isLoading, setIsLoading] = useState(false);
  const profileImage = cvData.personalInfo.profileImage;

  const saveSelectedImage = (uri: string) => {
    updatePersonalInfo({ ...cvData.personalInfo, profileImage: uri });
  };

  const selectFromGallery = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        saveSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("No se pudo abrir la galería:", error);
      Alert.alert(
        "No se pudo abrir la galería",
        "Intenta de nuevo o selecciona otra foto."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Autoriza el uso de la cámara para tomar una foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        saveSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("No se pudo abrir la cámara:", error);
      Alert.alert(
        "No se pudo abrir la cámara",
        "Comprueba que el dispositivo tenga una cámara disponible e intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo({ ...cvData.personalInfo, profileImage: undefined });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foto de perfil</Text>
      <Text style={styles.description}>
        Selecciona una foto de la galería o toma una nueva con la cámara.
      </Text>

      <View style={styles.preview}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            contentFit="cover"
            accessibilityLabel="Foto de perfil seleccionada"
            style={styles.image}
          />
        ) : (
          <Text style={styles.placeholderIcon}>👤</Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator
          accessibilityLabel="Abriendo selector de imagen"
          color="#3498db"
          size="large"
          style={styles.loading}
        />
      ) : (
        <>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isLoading}
            onPress={selectFromGallery}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Elegir de la galería</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isLoading}
            onPress={takePhoto}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Tomar una foto
            </Text>
          </TouchableOpacity>
          {profileImage ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={removePhoto}
              style={[styles.button, styles.removeButton]}
            >
              <Text style={styles.buttonText}>Quitar foto</Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 24,
  },
  title: {
    color: "#2c3e50",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  description: {
    color: "#7f8c8d",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 8,
    textAlign: "center",
  },
  preview: {
    alignItems: "center",
    backgroundColor: "#e8eef2",
    borderColor: "#d4dce2",
    borderRadius: 80,
    borderWidth: 1,
    height: 160,
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
    width: 160,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  placeholderIcon: {
    fontSize: 64,
  },
  loading: {
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 52,
    paddingHorizontal: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "#3498db",
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: "#3498db",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
  },
});