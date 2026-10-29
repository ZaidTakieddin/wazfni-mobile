import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React from "react";
import {
  Alert,
  Dimensions,
  I18nManager,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AvatarUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => void;
}

const { height } = Dimensions.get("window");

export default function AvatarUploadModal({ visible, onClose, onUpload }: AvatarUploadModalProps) {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطأ", "نحتاج إلى إذن للوصول إلى المعرض");
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطأ", "نحتاج إلى إذن للوصول إلى الكاميرا");
      return false;
    }
    return true;
  };

  const handleGalleryPick = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append("avatar", {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `avatar_${Date.now()}.jpg`,
        } as any);
        onUpload(formData);
        onClose();
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصورة من المعرض");
    }
  };

  const handleCameraPick = async () => {
    try {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append("avatar", {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `avatar_${Date.now()}.jpg`,
        } as any);
        onUpload(formData);
        onClose();
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء التقاط الصورة");
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append("avatar", {
          uri: asset.uri,
          type: mime.getType(asset.uri) || "image/jpeg",
          name: asset.name || `avatar_${Date.now()}.jpg`,
        } as any);
        onUpload(formData);
        onClose();
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الملف");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>اختر مصدر الصورة</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleCameraPick}>
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="camera" size={24} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>الكاميرا</Text>
                  <Text style={styles.optionDescription}>التقط صورة جديدة</Text>
                </View>
              </View>
              <Ionicons
                name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleGalleryPick}>
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="images" size={24} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>المعرض</Text>
                  <Text style={styles.optionDescription}>اختر صورة من المعرض</Text>
                </View>
              </View>
              <Ionicons
                name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleFilePick}>
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="folder" size={24} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>الملفات</Text>
                  <Text style={styles.optionDescription}>اختر من الملفات</Text>
                </View>
              </View>
              <Ionicons
                name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: 18,
    fontFamily: "RZ-Bold",
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  option: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
  },
  optionContent: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextContainer: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "RZ-Bold",
    color: Colors.text.primary,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: "RZ-Reg",
    color: Colors.text.secondary,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
});
