import { Urls } from "@/constants/Urls";
import axiosInstance from "@/utils/axiosInstance";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

const useDownloadFile = () => {
  const downloadFile = async (fileId: string, fileName?: string) => {
    try {
      if (!fileId) {
        Alert.alert("خطأ", "معرف الملف غير صحيح");
        return;
      }

      // Get the blob data
      const response = await axiosInstance.get(`${Urls.UPLOAD_URL}${fileId}`, {
        responseType: "blob",
      });

      const blob = response.data;

      // Convert blob to base64
      const reader = new FileReader();

      return new Promise<void>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(",")[1];

            // Determine file extension based on content type
            const contentType = blob.type || "application/pdf";
            let extension = ".pdf";

            if (contentType.includes("pdf")) {
              extension = ".pdf";
            } else if (contentType.includes("doc")) {
              extension = contentType.includes("docx") ? ".docx" : ".doc";
            } else if (contentType.includes("image")) {
              extension = contentType.split("/")[1] || ".jpg";
            }

            // Create file name
            const finalFileName = fileName
              ? `${fileName}${extension}`
              : `CV_${Date.now()}${extension}`;

            if (Platform.OS === "web") {
              // For web platform, create download link
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = finalFileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } else {
              // For mobile platforms, use FileSystem
              const fileUri = `${FileSystem.documentDirectory}${finalFileName}`;

              await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
              });

              // Check if sharing is available
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                  mimeType: contentType,
                  dialogTitle: "حفظ السيرة الذاتية",
                });
              } else {
                Alert.alert("تم الحفظ", `تم حفظ الملف في: ${fileUri}`);
              }
            }

            resolve();
          } catch (error) {
            console.error("Error downloading file:", error);
            Alert.alert("خطأ", "فشل في تحميل الملف");
            reject(error);
          }
        };

        reader.onerror = () => {
          Alert.alert("خطأ", "فشل في قراءة الملف");
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("خطأ", "فشل في تحميل الملف");
    }
  };

  return { downloadFile };
};

export default useDownloadFile;
